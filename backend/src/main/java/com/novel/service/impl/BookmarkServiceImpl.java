package com.novel.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.novel.dto.BookmarkRequest;
import com.novel.entity.Bookmark;
import com.novel.mapper.BookmarkMapper;
import com.novel.service.BookmarkService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookmarkServiceImpl extends ServiceImpl<BookmarkMapper, Bookmark> implements BookmarkService {

    @Override
    public List<Bookmark> list(Long userId, Long novelId) {
        return list(new LambdaQueryWrapper<Bookmark>()
                .eq(Bookmark::getUserId, userId)
                .eq(Bookmark::getNovelId, novelId)
                .orderByDesc(Bookmark::getCreatedAt));
    }

    @Override
    public void add(Long userId, BookmarkRequest request) {
        Bookmark bm = new Bookmark();
        bm.setUserId(userId);
        bm.setNovelId(request.getNovelId());
        bm.setChapterId(request.getChapterId());
        bm.setChapterNo(request.getChapterNo());
        bm.setPageOffset(request.getPageOffset());
        bm.setNote(request.getNote() != null ? request.getNote() : "");
        save(bm);
    }

    @Override
    public void remove(Long id) {
        removeById(id);
    }
}
