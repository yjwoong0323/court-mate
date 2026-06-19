package com.minton.courtmate.controller;

import com.minton.courtmate.dto.GameStartReq;
import com.minton.courtmate.dto.GameStartRes;
import com.minton.courtmate.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class GameController {

  private final GameService gameService;

  /**
   * 게임 생성 (시작)
   */
  @PostMapping("/courts/{courtId}/games/start")
  public ResponseEntity<GameStartRes> startGame(@PathVariable int courtId,
                                                @RequestBody GameStartReq req) {

    return ResponseEntity.ok(gameService.startGame(courtId, req));
  }

  @PatchMapping("/courts/{courtId}/games/current/end")
  public ResponseEntity<Void> endGame(@PathVariable int courtId) {
    gameService.endGame(courtId);

    return ResponseEntity.noContent().build();
  }

  @PatchMapping("/courts/{courtId}/games/current/move/{toCourtId}")
  public ResponseEntity<Void> moveCourtTo(@PathVariable int courtId, @PathVariable int toCourtId) {
    gameService.moveCourt(courtId, toCourtId);

    return ResponseEntity.noContent().build();
  }

  /**
   * 새로고침 후 화면 상태 복원을 위한 진행 중 게임 조회
   */
  @GetMapping("/games/playing")
  public ResponseEntity<List<GameStartRes>> getPlayingGames() {
    return ResponseEntity.ok(gameService.findPlayingGames());
  }
}
