package com.novel.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.novel.dto.ReadingRequest;
import com.novel.entity.ReadingHistory;
import com.novel.entity.ReadingProgress;
import com.novel.mapper.ReadingHistoryMapper;
import com.novel.mapper.ReadingProgressMapper;
import com.novel.service.ReadingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReadingServiceImpl implements ReadingService {

    private final ReadingProgressMapper progressMapper;
    private final ReadingHistoryMapper historyMapper;

    @Override
    @Transactional
    public void save(Long userId, ReadingRequest request) {
        ReadingProgress exist = progressMapper.selectOne(new LambdaQueryWrapper<ReadingProgress>()
                .eq(ReadingProgress::getUserId, userId)
                .eq(ReadingProgress::getNovelId, request.getNovelId()));
        if (exist != null) {
            exist.setChapterId(request.getChapterId());
            exist.setChapterNo(request.getChapterNo());
            exist.setPageOffset(request.getPageOffset());
            progressMapper.updateById(exist);
        } else {
            ReadingProgress rp = new ReadingProgress();
            rp.setUserId(userId);
            rp.setNovelId(request.getNovelId());
            rp.setChapterId(request.getChapterId());
            rp.setChapterNo(request.getChapterNo());
            rp.setPageOffset(request.getPageOffset());
            progressMapper.insert(rp);
        }
        // 记录历史
        ReadingHistory rh = new ReadingHistory();
        rh.setUserId(userId);
        rh.setNovelId(request.getNovelId());
        rh.setChapterId(request.getChapterId());
        rh.setChapterNo(request.getChapterNo());
        historyMapper.insert(rh);
    }

    @Override
    public ReadingProgress get(Long userId, Long novelId) {
        return progressMapper.selectOne(new LambdaQueryWrapper<ReadingProgress>()
                .eq(ReadingProgress::getUserId, userId)
                .eq(ReadingProgress::getNovelId, novelId));
    }
}
