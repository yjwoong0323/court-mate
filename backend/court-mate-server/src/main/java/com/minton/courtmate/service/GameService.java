package com.minton.courtmate.service;

import com.minton.courtmate.domain.Court;
import com.minton.courtmate.domain.CourtAssignment;
import com.minton.courtmate.domain.Game;
import com.minton.courtmate.domain.Player;
import com.minton.courtmate.dto.GameStartReq;
import com.minton.courtmate.dto.GameStartRes;
import com.minton.courtmate.repository.CourtAssignmentRepository;
import com.minton.courtmate.repository.CourtRepository;
import com.minton.courtmate.repository.GameRepository;
import com.minton.courtmate.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class GameService {

  private final PlayerRepository playerRepository;
  private final CourtRepository courtRepository;
  private final GameRepository gameRepository;
  private final CourtAssignmentRepository courtAssignmentRepository;

  /**
   * 게임 생성 (시작)
   */
  @Transactional
  public GameStartRes startGame(int courtId, GameStartReq req) {

    // 코트 조회
    Court gameCourt = courtRepository.findById(courtId)
        .orElseThrow(() -> new IllegalArgumentException("Not Found Court"));

    // 활성 코트인지 확인
    if (gameCourt.getCourtType() != Court.CourtType.ACTIVE) {
      throw new IllegalArgumentException("This Court Is For Waiting");
    }

    // 요청에서 선수 id 목록 추출
    if (req == null || req.getPlayerIds() == null) {
      throw new IllegalArgumentException("Required Player List");
    }
    List<Integer> playerIds = req.getPlayerIds();

    // 선수 수와 id 값 검증
    if (playerIds.size() != 4) {
      throw new IllegalArgumentException("Needed 4 Player To Start Game");
    }
    if (playerIds.contains(null)){
      throw new IllegalArgumentException("Player ID Must Not Be Null");
    }

    // 선수 중복 Validation
    Set<Integer> uniquePlayerIds = new HashSet<>(playerIds);
    if (uniquePlayerIds.size() != playerIds.size()){
      throw new IllegalArgumentException("Duplicated Player Exists");
    }

    // 요청된 선수들이 실제 DB에 존재하는 지 확인
    List<Player> players = playerRepository.findAllById(playerIds);
    if (players.size() != playerIds.size()){
      throw new IllegalArgumentException("Including Player Not Exists");
    }

    // 지금 참석 중인 지 확인
    boolean isAttendedPlayer = players.stream()
        .anyMatch(p -> p.getIsAttended());
    if (!isAttendedPlayer) {
      throw new IllegalArgumentException("Not Attended Player Included.");
    }

    // 선수들 중 이미 경기 중인 사람이 있는 지 확인
    boolean isPlayingPlayer = courtAssignmentRepository.existsByPlayer_IdInAndGame_Status(
        playerIds, Game.GameStatus.PLAYING
    );
    if (isPlayingPlayer) {
      throw new IllegalArgumentException("이미 게임 중인 선수가 있습니다");
    }

    // 이미 진행 중인 게임이 있는지 확인 (PLAYING 중인 게임은 '시작'할 수 없음)
    boolean isPlayingGame = gameRepository.existsByCourt_IdAndStatus(courtId, Game.GameStatus.PLAYING);
    if (isPlayingGame) {
      throw new IllegalArgumentException("해당 코트는 이미 게임 진행 중입니다");
    }

    // 게임 생성
    Game game = Game.start(gameCourt);
    Game savedGame = gameRepository.save(game);

    // 게임에 선수 배정
    List<CourtAssignment> assignments = players.stream()
        .map(player -> CourtAssignment.builder()
            .game(savedGame)
            .player(player)
            .build())
        .toList();

    courtAssignmentRepository.saveAll(assignments);

    return new GameStartRes(savedGame, players);
  }

  @Transactional
  public void endGame(int courtId) {
    // 해당 코트 게임 조회
    Game endedGame = gameRepository.findByCourt_IdAndStatus(courtId, Game.GameStatus.PLAYING)
        .orElseThrow(() -> new IllegalArgumentException("This Game Is Not Playing Now"));

    // 게임 종료
    endedGame.end();
  }
}
