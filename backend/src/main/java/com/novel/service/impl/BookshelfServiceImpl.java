package com.novel.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.novel.dto.BookshelfVO;
import com.novel.entity.*;
import com.novel.mapper.*;
import com.novel.service.BookshelfService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookshelfServiceImpl implements BookshelfService {

    private final BookshelfMapper bookshelfMapper;
    private final NovelMapper novelMapper;
    private final ChapterMapper chapterMapper;
    private final ReadingProgressMapper readingProgressMapper;

    @Override
    public List<BookshelfVO> list(Long userId, String category) {
        LambdaQueryWrapper<Bookshelf> wrapper = new LambdaQueryWrapper<Bookshelf>()
                .eq(Bookshelf::getUserId, userId);
        if (category != null && !category.isBlank()) {
            wrapper.eq(Bookshelf::getCategory, category);
        }
        List<Bookshelf> shelves = bookshelfMapper.selectList(wrapper);
        List<BookshelfVO> vos = new ArrayList<>();
        for (Bookshelf s : shelves) {
            Novel novel = novelMapper.selectById(s.getNovelId());
            if (novel == null) continue;
            BookshelfVO vo = new BookshelfVO();
            vo.setId(s.getId());
            vo.setNovelId(novel.getId());
            vo.setNovelTitle(novel.getTitle());
            vo.setNovelCover(novel.getCover());
            vo.setNovelAuthor(novel.getAuthor());
            vo.setNovelStatus(novel.getStatus());
            vo.setCategory(s.getCategory());
            Chapter latest = chapterMapper.selectList(new LambdaQueryWrapper<Chapter>()
                    .eq(Chapter::getNovelId, novel.getId())
                    .orderByDesc(Chapter::getChapterNo).last("LIMIT 1"))
                    .stream().findFirst().orElse(null);
            if (latest != null) {
                vo.setLatestChapterNo(latest.getChapterNo());
                vo.setLatestChapterTitle(latest.getTitle());
            }
            // 查询第一章ID（用于无进度时跳转）
            Chapter first = chapterMapper.selectList(new LambdaQueryWrapper<Chapter>()
                    .eq(Chapter::getNovelId, novel.getId())
                    .orderByAsc(Chapter::getChapterNo).last("LIMIT 1"))
                    .stream().findFirst().orElse(latest);
            if (first != null) {
                vo.setFirstChapterId(first.getId());
            }
            ReadingProgress progress = readingProgressMapper.selectOne(new LambdaQueryWrapper<ReadingProgress>()
                    .eq(ReadingProgress::getUserId, userId)
                    .eq(ReadingProgress::getNovelId, novel.getId()));
            if (progress != null) {
                vo.setProgress("第" + progress.getChapterNo() + "章");
                vo.setProgressChapterNo(progress.getChapterNo());
                vo.setProgressChapterId(progress.getChapterId());
            }
            vos.add(vo);
        }
        return vos;
    }

    @Override
    public void add(Long userId, Long novelId) {
        if (bookshelfMapper.selectCount(new LambdaQueryWrapper<Bookshelf>()
                .eq(Bookshelf::getUserId, userId)
                .eq(Bookshelf::getNovelId, novelId)) > 0) {
            throw new RuntimeException("已在书架中");
        }
        Bookshelf shelf = new Bookshelf();
        shelf.setUserId(userId);
        shelf.setNovelId(novelId);
        shelf.setCategory("READING");
        bookshelfMapper.insert(shelf);
    }

    @Override
    public void updateCategory(Long userId, Long id, String category) {
        Bookshelf shelf = bookshelfMapper.selectById(id);
        if (shelf == null || !shelf.getUserId().equals(userId))
            throw new RuntimeException("记录不存在");
        shelf.setCategory(category);
        bookshelfMapper.updateById(shelf);
    }

    @Override
    public void remove(Long userId, Long novelId) {
        bookshelfMapper.delete(new LambdaQueryWrapper<Bookshelf>()
                .eq(Bookshelf::getUserId, userId)
                .eq(Bookshelf::getNovelId, novelId));
    }
}
