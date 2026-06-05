package com.minton.courtmate.dto;

import com.minton.courtmate.domain.Game;
import com.minton.courtmate.domain.Player;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class GameStartRes {
  private int id;
  private int courtId;
  private Game.GameStatus status;
  private LocalDateTime startedAt;
  private LocalDateTime endedAt;
  private List<PlayerCreateRes> players;

  public GameStartRes(Game game, List<Player> players) {
    this.id = game.getId();
    this.courtId = game.getCourt().getId();
    this.status = game.getStatus();
    this.startedAt = game.getStartedAt();
    this.endedAt = game.getEndedAt();
    this.players = players.stream()
        .map(PlayerCreateRes::new)
        .toList();
  }
}
