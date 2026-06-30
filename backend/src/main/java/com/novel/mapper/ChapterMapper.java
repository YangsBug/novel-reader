package com.novel.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.novel.entity.Chapter;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface ChapterMapper extends BaseMapper<Chapter> {

    @Select("SELECT id, title, chapter_no, word_count FROM chapters WHERE novel_id = #{novelId} ORDER BY chapter_no ASC")
    java.util.List<com.novel.dto.ChapterDTO> selectSimpleListByNovelId(Long novelId);
}
