package com.minton.courtmate.dto;

import com.minton.courtmate.domain.Court;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 코트 생성 Request DTO
 */
@Getter
@NoArgsConstructor
public class CourtCreateReq {
  private String name;
  private Court.CourtType courtType;

  public Court toEntity() {
    return Court.builder()
        .name(name)
        .courtType(courtType)
        .build();
  }
}
