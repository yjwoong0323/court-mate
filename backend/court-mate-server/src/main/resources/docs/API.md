# CourtMate API 간단 명세서

## Player
- `POST /api/players` // 플레이어 생성
### 선수 조건 조회
- `GET /api/players`
  `GET /api/players?level=A`
  `GET /api/players?sex=M&level=A`
  `GET /api/players?isAttended=true`
  `GET /api/players?sex=W&level=S&isAttended=false`

- `GET /api/players/{id}` // 플레이어 단건 조회
- `PATCH /api/players/{id}/changeIsAttended` // 플레이어 참석 상태 변경
- `DELETE /api/players/{id}` // 플레이어 삭제

## Court
- `POST /api/courts` // 코트 생성
- `GET /api/courts` // 코트 전체 조회

## Game
- `GET /api/games/playing` // 진행 중 게임과 배정 선수 조회 (새로고침 상태 복원)
- `POST /api/courts/{courtId}/games/start` // 해당 코트 게임 시작
- `PATCH /api/courts/{courtId}/games/current/end` // 해당 코트 현재 게임 종료
- `PATCH /api/courts/{courtId}/games/current/move/{toCourtId}` // 코트 이동
