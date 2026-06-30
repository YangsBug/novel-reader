package com.novel.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.novel.dto.ReadingProgressDTO;
import com.novel.entity.ReadingHistory;
import com.novel.entity.ReadingProgress;
import com.novel.mapper.ReadingHistoryMapper;
import com.novel.mapper.ReadingProgressMapper;
import com.novel.service.ReadingProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReadingProgressServiceImpl implements ReadingProgressService {

    private final ReadingProgressMapper progressMapper;
    private final ReadingHistoryMapper historyMapper;

    @Override
    @Transactional
    public void save(Long userId, ReadingProgressDTO dto) {
        ReadingProgress progress = progressMapper.selectOne(new LambdaQueryWrapper<ReadingProgress>()
                .eq(ReadingProgress::getUserId, userId)
                .eq(ReadingProgress::getNovelId, dto.getNovelId()));
        if (progress == null) {
            progress = new ReadingProgress();
            progress.setUserId(userId);
            progress.setNovelId(dto.getNovelId());
        }
        progress.setChapterId(dto.getChapterId());
        progress.setChapterNo(dto.getChapterNo());
        progress.setPageOffset(dto.getPageOffset());
        progress.setIsCurrent(1);
        if (progress.getId() == null) {
            progressMapper.insert(progress);
        } else {
            progressMapper.updateById(progress);
        }

        ReadingHistory history = new ReadingHistory();
        history.setUserId(userId);
        history.setNovelId(dto.getNovelId());
        history.setChapterId(dto.getChapterId());
        history.setChapterNo(dto.getChapterNo());
        history.setIsCurrent(1);
        historyMapper.insert(history);
    }

    @Override
    public ReadingProgress get(Long userId, Long novelId) {
        return progressMapper.selectOne(new LambdaQueryWrapper<ReadingProgress>()
                .eq(ReadingProgress::getUserId, userId)
                .eq(ReadingProgress::getNovelId, novelId));
    }
}
