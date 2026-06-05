package com.minton.courtmate.repository;

import com.minton.courtmate.domain.Player;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlayerRepository extends JpaRepository<Player, Integer>{
  List<Player> findAllByIsAttendedTrue();
  List<Player> findAllByIsAttendedFalse();
}
