# CourtMate API 간단 명세

Base URL: `http://localhost:8080`

## Player 관련
- `POST /api/players` // 플레이어 생성 OK
### 선수 조건 조회
- `GET /api/players`
  `GET /api/players?level=A`
  `GET /api/players?sex=M&level=A`
  `GET /api/players?isAttended=true`
  `GET /api/players?sex=W&level=S&isAttended=false`

- `GET /api/players/{id}` // 플레이어 단건 조회
- `PATCH /api/players/{id}/changeIsAttended` // 플레이어 참석 상태 변경
- `DELETE /api/players/{id}` // 플레이어 삭제

## Court 관련
- `GET /api/courts` // 코트 전체 조회 OK

## Game 관련
- `POST /api/courts/{courtId}/games/start` // 해당 코트에서 게임 시작 OK
- `PATCH /api/courts/{courtId}/games/current/end` // 해당 코트의 현재 게임 종료 OK
- `PATCH /api/courts/{courtId}/games/current/move/{toCourtId}` // 코트 이동