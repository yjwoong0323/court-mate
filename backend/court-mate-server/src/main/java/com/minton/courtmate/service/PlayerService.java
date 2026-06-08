package com.minton.courtmate.service;

import com.minton.courtmate.domain.Player;
import com.minton.courtmate.dto.PlayerCreateReq;
import com.minton.courtmate.dto.PlayerCreateRes;
import com.minton.courtmate.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlayerService {

  private final PlayerRepository playerRepository;

  /**
   * 선수 추가
   */
  @Transactional
  public PlayerCreateRes addPlayer(PlayerCreateReq req) {
    Player newPlayer = playerRepository.save(req.toEntity());

    return new PlayerCreateRes(newPlayer);
  }

  /**
   * 선수 전체 조회
   */
  @Transactional(readOnly = true)
  public List<PlayerCreateRes> findAll() {
    return playerRepository.findAll()
        .stream()
        .map(PlayerCreateRes::new)
        .toList();
  }

  /**
   * 선수 조건 조회
   */
  @Transactional(readOnly = true)
  public List<PlayerCreateRes> findPlayersBy(
      Player.Sex sex, String level, Boolean isAttended
  ) {
    List<Player> players;

    if (sex != null && level != null && isAttended != null) {
      players = playerRepository.findAllBySexAndLevelAndIsAttended(sex, level, isAttended);
    } else if (sex != null && level != null) {
      players = playerRepository.findAllBySexAndLevel(sex, level);
    } else if (sex != null && isAttended != null) {
      players = playerRepository.findAllBySexAndIsAttended(sex, isAttended);
    } else if (level != null && isAttended != null) {
      players = playerRepository.findAllByLevelAndIsAttended(level, isAttended);
    } else if (sex != null) {
      players = playerRepository.findAllBySex(sex);
    } else if (level != null) {
      players = playerRepository.findAllByLevel(level);
    } else if (isAttended != null) {
      players = playerRepository.findAllByIsAttended(isAttended);
    } else {
      players = playerRepository.findAll();
    }

    return players.stream()
        .map(PlayerCreateRes::new)
        .toList();
  }

  /**
   * 특정 선수 조회
   */
  @Transactional(readOnly = true)
  public PlayerCreateRes findById(int id) {
    Player player = playerRepository.findById(id).
        orElseThrow(() -> new IllegalArgumentException("NO PLAYER: " + id));

    return new PlayerCreateRes(player);
  }

  /**
   * 특정 선수 삭제
   */
  @Transactional
  public void delete(int playerId) {
    Player player = playerRepository.findById(playerId)
            .orElseThrow(() -> new IllegalArgumentException("NO PLAYER: " + playerId));

    playerRepository.deleteById(playerId);
  }

  /**
   * 선수 참석 상태 변경
   */
  @Transactional
  public void changeIsAttended(int playerId) {
    Player player = playerRepository.findById(playerId)
        .orElseThrow(() -> new IllegalArgumentException("NO PLAYER: " + playerId));

    player.setIsAttended(!player.getIsAttended());
  }
}