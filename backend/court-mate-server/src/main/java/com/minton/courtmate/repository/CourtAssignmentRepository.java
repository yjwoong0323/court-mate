package com.minton.courtmate.repository;

import com.minton.courtmate.domain.CourtAssignment;
import com.minton.courtmate.domain.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourtAssignmentRepository extends JpaRepository<CourtAssignment, Integer>{
  boolean existsByPlayer_IdInAndGame_Status(
      List<Integer> playerIds,
      Game.GameStatus status
  );

  @Query("""
      SELECT assignment
      FROM CourtAssignment assignment
      JOIN FETCH assignment.game game
      JOIN FETCH game.court
      JOIN FETCH assignment.player
      WHERE game.status = :status
      ORDER BY game.id ASC, assignment.id ASC
      """)
  List<CourtAssignment> findAllByGameStatusWithPlayers(
      @Param("status") Game.GameStatus status
  );
}
