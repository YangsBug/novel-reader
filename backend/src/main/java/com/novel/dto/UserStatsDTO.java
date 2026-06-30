package com.novel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserStatsDTO {
    private long totalBooks;
    private long readingBooks;
    private long finishedBooks;
    private long wantBooks;
}
