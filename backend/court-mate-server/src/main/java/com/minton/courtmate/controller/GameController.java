package com.minton.courtmate.controller;

import com.minton.courtmate.dto.GameStartReq;
import com.minton.courtmate.dto.GameStartRes;
import com.minton.courtmate.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courts/{courtId}")
@RequiredArgsConstructor
public class GameController {

  private final GameService gameService;

  /**
   * 게임 생성 (시작)
   */
  @PostMapping("/games/start")
  public ResponseEntity<GameStartRes> startGame(@PathVariable int courtId,
                                                @RequestBody GameStartReq req) {

    return ResponseEntity.ok(gameService.startGame(courtId, req));
  }

  @PatchMapping("/games/current/end")
  public ResponseEntity<Void> endGame(@PathVariable int courtId) {
    gameService.endGame(courtId);

    return ResponseEntity.noContent().build();
  }
}
