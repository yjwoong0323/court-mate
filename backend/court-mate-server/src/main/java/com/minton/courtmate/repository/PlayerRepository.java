package com.minton.courtmate.repository;

import com.minton.courtmate.domain.Player;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlayerRepository extends JpaRepository<Player, Integer>{
  /**
   * 조회 필터링
   */
  List<Player> findAllByIsAttended(Boolean isAttended);
  List<Player> findAllBySex(Player.Sex sex);
  List<Player> findAllByLevel(String level);
  List<Player> findAllBySexAndIsAttended(Player.Sex sex, Boolean isAttended);
  List<Player> findAllBySexAndLevel(Player.Sex sex, String level);
  List<Player> findAllByLevelAndIsAttended(String level, Boolean isAttended);
  List<Player> findAllBySexAndLevelAndIsAttended(Player.Sex sex, String level, Boolean isAttended);
}
