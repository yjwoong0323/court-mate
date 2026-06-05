package com.minton.courtmate.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "game")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Game {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "court_id", nullable = false)
  private Court court;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private GameStatus status;

  @Column(name = "started_at", nullable = false)
  private LocalDateTime startedAt;

  @Column(name = "ended_at")
  private LocalDateTime endedAt;

  public enum GameStatus {
    PLAYING, FINISHED
  }

  @Builder
  private Game(Court court, GameStatus status, LocalDateTime startedAt){
    this.court = court;
    this.status = status;
    this.startedAt = startedAt;
  }

  public static Game start(Court court) {
    return Game.builder()
        .court(court)
        .status(GameStatus.PLAYING)
        .startedAt(LocalDateTime.now())
        .build();
  }

  public void end() {
    if (this.status == GameStatus.FINISHED){
      throw new IllegalStateException("Already Finished Game.");
    }
    this.status = GameStatus.FINISHED;
    this.endedAt = LocalDateTime.now();
  }
}
