package com.minton.courtmate.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "court_assignment")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CourtAssignment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "game_id", nullable = false)
  private Game game;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "player_id", nullable = false)
  private Player player;

  @Builder
  public CourtAssignment(Game game, Player player) {
    this.game = game;
    this.player = player;
  }
}
