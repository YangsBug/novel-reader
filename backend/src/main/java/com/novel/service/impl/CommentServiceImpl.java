package com.novel.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.novel.dto.CommentVO;
import com.novel.dto.PageResult;
import com.novel.entity.Comment;
import com.novel.entity.CommentLike;
import com.novel.entity.User;
import com.novel.mapper.CommentLikeMapper;
import com.novel.mapper.CommentMapper;
import com.novel.mapper.UserMapper;
import com.novel.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentMapper commentMapper;
    private final CommentLikeMapper commentLikeMapper;
    private final UserMapper userMapper;

    @Override
    public PageResult<CommentVO> list(Long novelId, int page, int pageSize, Long userId) {
        IPage<Comment> p = commentMapper.selectPage(new Page<>(page, pageSize),
                new LambdaQueryWrapper<Comment>()
                        .eq(Comment::getNovelId, novelId)
                        .isNull(Comment::getParentId)
                        .orderByDesc(Comment::getCreateTime));

        List<CommentVO> vos = p.getRecords().stream().map(c -> toVO(c, userId)).collect(Collectors.toList());
        return new PageResult<>(vos, p.getTotal(), page, pageSize);
    }

    @Override
    @Transactional
    public void add(Long userId, Long novelId, String content, Long parentId) {
        Comment comment = new Comment();
        comment.setUserId(userId);
        comment.setNovelId(novelId);
        comment.setContent(content);
        comment.setParentId(parentId);
        comment.setLikeCount(0L);
        commentMapper.insert(comment);
    }

    @Override
    @Transactional
    public void like(Long userId, Long commentId) {
        if (commentLikeMapper.selectCount(new LambdaQueryWrapper<CommentLike>()
                .eq(CommentLike::getUserId, userId)
                .eq(CommentLike::getCommentId, commentId)) > 0) {
            // 取消点赞
            commentLikeMapper.delete(new LambdaQueryWrapper<CommentLike>()
                    .eq(CommentLike::getUserId, userId)
                    .eq(CommentLike::getCommentId, commentId));
            Comment comment = commentMapper.selectById(commentId);
            comment.setLikeCount(Math.max(0, comment.getLikeCount() - 1));
            commentMapper.updateById(comment);
        } else {
            CommentLike like = new CommentLike();
            like.setUserId(userId);
            like.setCommentId(commentId);
            commentLikeMapper.insert(like);
            Comment comment = commentMapper.selectById(commentId);
            comment.setLikeCount(comment.getLikeCount() + 1);
            commentMapper.updateById(comment);
        }
    }

    private CommentVO toVO(Comment comment, Long currentUserId) {
        User user = userMapper.selectById(comment.getUserId());
        CommentVO vo = new CommentVO();
        vo.setId(comment.getId());
        vo.setUserId(comment.getUserId());
        vo.setUsername(user != null ? user.getNickname() : "匿名");
        vo.setAvatar(user != null ? user.getAvatar() : "");
        vo.setNovelId(comment.getNovelId());
        vo.setContent(comment.getContent());
        vo.setLikeCount(comment.getLikeCount());
        vo.setCreateTime(comment.getCreateTime());
        if (currentUserId != null) {
            vo.setLiked(commentLikeMapper.selectCount(new LambdaQueryWrapper<CommentLike>()
                    .eq(CommentLike::getUserId, currentUserId)
                    .eq(CommentLike::getCommentId, comment.getId())) > 0);
        }
        // 加载回复
        List<Comment> replies = commentMapper.selectList(new LambdaQueryWrapper<Comment>()
                .eq(Comment::getParentId, comment.getId())
                .orderByAsc(Comment::getCreateTime));
        if (!replies.isEmpty()) {
            vo.setReplies(replies.stream().map(r -> toVO(r, currentUserId)).collect(Collectors.toList()));
        }
        return vo;
    }
}
