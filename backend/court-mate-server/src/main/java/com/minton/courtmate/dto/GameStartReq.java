package com.minton.courtmate.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 게임 생성 Request DTO
 */
@Getter
@NoArgsConstructor
public class GameStartReq {
  private List<Integer> playerIds;
}
