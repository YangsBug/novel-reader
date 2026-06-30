package com.novel.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.novel.dto.BookmarkDTO;
import com.novel.entity.Bookmark;
import com.novel.mapper.BookmarkMapper;
import com.novel.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookmarkServiceImpl implements BookmarkService {

    private final BookmarkMapper bookmarkMapper;

    @Override
    public List<Bookmark> list(Long userId, Long novelId) {
        return bookmarkMapper.selectList(new LambdaQueryWrapper<Bookmark>()
                .eq(Bookmark::getUserId, userId)
                .eq(Bookmark::getNovelId, novelId)
                .orderByDesc(Bookmark::getCreateTime));
    }

    @Override
    public void add(Long userId, BookmarkDTO dto) {
        Bookmark bm = new Bookmark();
        bm.setUserId(userId);
        bm.setNovelId(dto.getNovelId());
        bm.setChapterId(dto.getChapterId());
        bm.setChapterNo(dto.getChapterNo());
        bm.setPageOffset(dto.getPageOffset());
        bm.setNote(dto.getNote());
        bookmarkMapper.insert(bm);
    }

    @Override
    public void remove(Long userId, Long id) {
        bookmarkMapper.delete(new LambdaQueryWrapper<Bookmark>()
                .eq(Bookmark::getId, id).eq(Bookmark::getUserId, userId));
    }
}
