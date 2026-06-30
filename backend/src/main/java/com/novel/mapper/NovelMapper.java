package com.novel.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.novel.entity.Novel;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface NovelMapper extends BaseMapper<Novel> {
    @Select("SELECT category_id FROM novel_categories WHERE novel_id = #{novelId}")
    List<Long> selectCategoryIds(Long novelId);
}
