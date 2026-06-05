package com.minton.courtmate.repository;

import com.minton.courtmate.domain.CourtAssignment;
import com.minton.courtmate.domain.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourtAssignmentRepository extends JpaRepository<CourtAssignment, Integer>{
  boolean existsByPlayer_IdInAndGame_Status(
      List<Integer> playerIds,
      Game.GameStatus status
  );
}