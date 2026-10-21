# Canvas Outliner

Obsidian Canvas용 데스크톱 플러그인입니다. Windows Sandbox에서 검증했습니다.

- **Outliner / Collection**: Canvas 그룹과 등록한 카드를 정리하고, 이름 변경·순서 이동·검색을 제공합니다.
- **Presentation**: 카드 또는 독립된 PT 화면 영역을 순서대로 탐색합니다. PT 영역 이동·크기 조절은 내부 카드를 변경하지 않습니다.
- **Remote Outliner**: 커서 위치에서 열리는 이동·크기 조절 가능한 창입니다.
- **Canvas Search**: 미등록 카드를 포함해 현재 Canvas를 검색합니다. 단어 순서와 관계없이 모든 입력 단어를 찾으며, 제목·줄 검색을 지원합니다.

## 설치

BRAT 설정의 **Add beta plugin**에서 `tlatndms2-droid/obsidian-canvas-outliner`를 추가하세요. 활성화 후 명령 팔레트에서 Canvas Outliner를 열 수 있습니다.

수동 설치는 Release의 `main.js`, `manifest.json`, `styles.css`를 Vault의 `.obsidian/plugins/canvas-outliner/`에 넣고 플러그인을 활성화하세요. 기존 `data.json`은 유지하세요.

## 단축키

Canvas에서만 동작하며 카드 편집·문자 입력을 보호합니다.

| 키 | 동작 |
|---|---|
| P | 발표 모드 켜기 / 끄기 |
| V | PT Vision 켜기 / 끄기 |
| O | Remote Outliner 열기 / 닫기 |
| Alt+F | Canvas Search 열기 / 닫기 |
| 좌우 방향키 | 발표 이전 / 다음 |
| 상단 숫자키 → Enter | 해당 발표 순서로 이동 |
| Esc | 발표 종료 |

## 저장과 검증 범위

Collection·등록·발표 설정은 플러그인 데이터에 저장합니다. Canvas 복제 식별을 위한 파일 식별 정보가 `.canvas`에 추가됩니다. 카드 본문·위치·크기는 이름 별칭이나 PT 영역 편집으로 변경하지 않습니다.

0.1.46부터 설정은 임시 파일에 쓰고 확인한 뒤 교체합니다. 현재 설정 파일이 손상됐다면 정상 `data.backup.json`에서 복구하고 손상 파일도 별도로 보존합니다. 두 파일 모두 손상됐으면 덮어쓰지 않습니다. 업데이트할 때 `data.json`과 `data.backup.json`을 삭제하지 마세요.

아직 사용하지 않은 일반 Canvas는 초기 실행 때 설정에 복사하지 않고 실제로 열 때 처리합니다. 기존 구성과 복제 식별 정보가 있는 Canvas는 계속 확인합니다. 저장이 밀려도 전체 설정 복사본을 무제한 대기시키지 않습니다.

0.1.45는 타입 검사·빌드·자동 테스트 37개 및 기능별 Sandbox UI·재시작 검증을 거친 첫 공개 릴리즈입니다. 다른 플러그인과의 호환성 및 실제 다른 PC 동기화는 이번 검증 범위에서 제외했습니다.

## 개발

`npm install` → `npm run check` → `npm run build` → `npm test`

이 저장소의 번호가 붙은 초기 기획 문서는 개발 전 기록입니다. 현재 설치 방법과 동작은 이 README 및 Release 설명을 우선하세요.
