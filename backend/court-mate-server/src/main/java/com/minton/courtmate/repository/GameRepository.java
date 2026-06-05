package com.minton.courtmate.repository;

import com.minton.courtmate.domain.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GameRepository extends JpaRepository<Game, Integer>{
  boolean existsByCourt_IdAndStatus(int courtId, Game.GameStatus status);
  Optional<Game> findByCourt_IdAndStatus(int courtId, Game.GameStatus status);
}