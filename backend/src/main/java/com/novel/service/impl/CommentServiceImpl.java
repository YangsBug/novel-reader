package com.novel.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.novel.common.PageResult;
import com.novel.dto.CommentRequest;
import com.novel.entity.*;
import com.novel.mapper.*;
import com.novel.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentMapper commentMapper;
    private final CommentLikeMapper commentLikeMapper;
    private final UserMapper userMapper;

    @Override
    public PageResult<Map<String, Object>> list(Long userId, Long novelId, Integer pageNum, Integer pageSize) {
        // 查父评论（分页）
        Page<Comment> page = new Page<>(pageNum, pageSize);
        Page<Comment> result = commentMapper.selectPage(page, new LambdaQueryWrapper<Comment>()
                .eq(Comment::getNovelId, novelId)
                .isNull(Comment::getParentId)
                .orderByDesc(Comment::getCreatedAt));

        List<Comment> parents = result.getRecords();
        if (parents.isEmpty()) {
            return PageResult.of(Collections.emptyList(), 0, pageNum, pageSize);
        }

        Set<Long> parentIds = new HashSet<>();
        Set<Long> allUserIds = new HashSet<>();
        List<Map<String, Object>> list = new ArrayList<>();

        for (Comment c : parents) {
            parentIds.add(c.getId());
            allUserIds.add(c.getUserId());
        }

        // 查回复
        List<Comment> replies = commentMapper.selectList(new LambdaQueryWrapper<Comment>()
                .in(Comment::getParentId, parentIds).orderByAsc(Comment::getCreatedAt));
        Map<Long, List<Comment>> replyMap = new HashMap<>();
        for (Comment r : replies) {
            replyMap.computeIfAbsent(r.getParentId(), k -> new ArrayList<>()).add(r);
            allUserIds.add(r.getUserId());
        }

        // 查用户信息
        Map<Long, User> userMap = new HashMap<>();
        if (!allUserIds.isEmpty()) {
            userMapper.selectBatchIds(allUserIds).forEach(u -> userMap.put(u.getId(), u));
        }

        // 查当前用户点赞状态
        Set<Long> likedIds = new HashSet<>();
        if (userId != null) {
            commentLikeMapper.selectList(new LambdaQueryWrapper<CommentLike>()
                    .eq(CommentLike::getUserId, userId))
                    .forEach(l -> likedIds.add(l.getCommentId()));
        }

        for (Comment c : parents) {
            list.add(toCommentVO(c, replyMap, userMap, likedIds));
        }

        return PageResult.of(list, result.getTotal(), pageNum, pageSize);
    }

    private Map<String, Object> toCommentVO(Comment c, Map<Long, List<Comment>> replyMap,
                                             Map<Long, User> userMap, Set<Long> likedIds) {
        User u = userMap.get(c.getUserId());
        Map<String, Object> vo = new LinkedHashMap<>();
        vo.put("id", c.getId());
        vo.put("userId", c.getUserId());
        vo.put("username", u != null ? u.getNickname() : "匿名");
        vo.put("avatar", u != null ? u.getAvatar() : "");
        vo.put("novelId", c.getNovelId());
        vo.put("content", c.getContent());
        vo.put("likeCount", c.getLikeCount());
        vo.put("liked", likedIds.contains(c.getId()));
        vo.put("createTime", c.getCreatedAt() != null ? c.getCreatedAt().toString() : null);

        List<Comment> childReplies = replyMap.get(c.getId());
        if (childReplies != null && !childReplies.isEmpty()) {
            List<Map<String, Object>> replyVOs = new ArrayList<>();
            for (Comment r : childReplies) {
                User ru = userMap.get(r.getUserId());
                Map<String, Object> rvo = new LinkedHashMap<>();
                rvo.put("id", r.getId());
                rvo.put("userId", r.getUserId());
                rvo.put("username", ru != null ? ru.getNickname() : "匿名");
                rvo.put("avatar", ru != null ? ru.getAvatar() : "");
                rvo.put("novelId", r.getNovelId());
                rvo.put("content", r.getContent());
                rvo.put("likeCount", r.getLikeCount());
                rvo.put("liked", likedIds.contains(r.getId()));
                rvo.put("createTime", r.getCreatedAt() != null ? r.getCreatedAt().toString() : null);
                replyVOs.add(rvo);
            }
            vo.put("replies", replyVOs);
        }
        return vo;
    }

    @Override
    @Transactional
    public void add(Long userId, Long novelId, CommentRequest request) {
        Comment comment = new Comment();
        comment.setUserId(userId);
        comment.setNovelId(novelId);
        comment.setContent(request.getContent());
        comment.setParentId(request.getParentId());
        comment.setLikeCount(0);
        commentMapper.insert(comment);
    }

    @Override
    @Transactional
    public void like(Long userId, Long commentId) {
        CommentLike exist = commentLikeMapper.selectOne(new LambdaQueryWrapper<CommentLike>()
                .eq(CommentLike::getUserId, userId)
                .eq(CommentLike::getCommentId, commentId));
        if (exist != null) {
            commentLikeMapper.deleteById(exist.getId());
            // 减少点赞数
            Comment c = commentMapper.selectById(commentId);
            if (c != null && c.getLikeCount() > 0) {
                c.setLikeCount(c.getLikeCount() - 1);
                commentMapper.updateById(c);
            }
        } else {
            CommentLike cl = new CommentLike();
            cl.setUserId(userId);
            cl.setCommentId(commentId);
            commentLikeMapper.insert(cl);
            Comment c = commentMapper.selectById(commentId);
            if (c != null) {
                c.setLikeCount(c.getLikeCount() + 1);
                commentMapper.updateById(c);
            }
        }
    }
}
