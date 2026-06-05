package com.minton.courtmate.repository;

import com.minton.courtmate.domain.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, Integer>{
  boolean existsByCourt_IdAndStatus(int courtId, Game.GameStatus status);
}