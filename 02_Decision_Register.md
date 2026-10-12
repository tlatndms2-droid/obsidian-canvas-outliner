# 결정 기록 — 출처 및 최종 우선순위

> 표의 항목은 이 대화에서 사용자가 명시한 원본 기획 또는 후속 확정에 근거한다. 최신 변경은 이전 결정보다 우선한다. 아래 항목은 전체 기획에 관한 요약이며 파일명·구현 코드는 확정하지 않는다.

| ID/영역 | 최종 확정 | 비고 |
|---|---|---|
| 원본 | Collection 가상 분류, 실제 Group 자동 반영, 일반 Item 수동 등록, Presentation 별도 Space, Canvas Search 분리 | 최초 원문 |
| Q01 | Collection은 단일 상위 Collection에만 소속, 일반 Canvas Item은 Collection 다중 소속 | 계층 순환 금지 |
| Q02 | Collection 안의 Group은 단일 항목으로 표시하고 하위 Group 구조를 그 위치에서 펼치지 않음. 미등록 일반 Item은 노출 금지 | 후속 사용자 B 선택 설명 우선 |
| Q03 | Collection/Group 미소속 등록 Item은 Outliner 최상위 직접 표시 | 자동 미분류 폴더 없음 |
| Q04 | 실제 Group Item 총수와 등록 수 함께 표시 | 미등록 Item 나열 아님 |
| Q05 | 다중 선택 등록·분류·Presentation 추가 일괄 지원 |  |
| Q06 | Outliner ↔ Canvas 선택 동기화, Outliner 선택 시 Shift+2에 준하는 선택 Fit | 화면 이동 포함 |
| Q07 | Ctrl+Drag 복제 일반 Item은 미등록, Group 복제는 자동 등록 | 실제 사용자 환경 단축키 관찰 |
| 추가 | 등록 일반 Canvas Item에는 우측 상단 아이콘; 자동 충돌 회피 가능 범위 + 수동 위치 설정, 표시 ON/OFF | 검증 전 자동 완전 회피 보장 금지 |
| Q08 | Canvas에서 Group 밖 이동해도 직접 지정 Collection/Presentation 유지, 실제 Group 계층만 변경 |  |
| Q09 | 삭제된 Item은 Outliner/Presentation UI에서 숨김 |  |
| Q10 | 동일 내용 새 Item에 삭제된 참조 수동 재연결 금지. Ctrl+Z 복구만 연결 회복 대상 |  |
| Q11 | 삭제 Node 참조는 현재 Canvas 작업 세션에서만 임시 보존, 닫고 다시 열면 정리 |  |
| Q12 | Collection 이동·삭제·분류 변경 Undo(Ctrl+Z) 지원 | 충돌 검증은 Codex |
| Q13 | Text Card 첫 번째 텍스트를 표시 이름으로 사용, 사용자가 표시 이름 수정 가능, 원본 문장 변경 금지 |  |
| Q14 | 생성순/업데이트순 = Canvas Item 자체의 시각 | 기술적 기록 방식 미확정 |
| Q15 | 크기순 = Canvas Item의 가로×세로 면적 |  |
| Q16 | 자동 정렬 중 순서 Drag 금지, Custom일 때만 순서 변경, Custom 독립 보존 |  |
| Q18 | Presentation에서 같은 실제 Item 중복 등록 허용 | 등록 순서별 독립 |
| Q19 | Collection 자체는 Presentation 대상 제외, 하위 실제 Item은 개별/일괄 등록 |  |
| Q20 | 발표 중 순서 변경 시 현재 **등록 항목** 유지, 다음/이전은 변경된 순서 적용 |  |
| Q21 | 삭제된 발표 대상 건너뜀, Ctrl+Z 복구 시 원래 순서 복원 | Q09와 정합 |
| Q22 | Presentation Group 생성 후 이동·크기 변경·이름 변경·삭제 지원 |  |
| Q23 | PT Vision OFF에서 편집하려면 ON으로 전환. OFF 예외 표시 기능 제외 |  |
| Q24 | Presentation Group끼리/일반 Group·Item과 중첩 허용 |  |
| Q25 | Presentation ON/OFF와 Presentation View 독립 |  |
| Q26 | 방향키는 Canvas 탐색 중에만 사용, 텍스트·검색·Popup 입력 중 기본 기능 우선 |  |
| Q27 | 부드러운 Pan/Zoom 전환. 발표 중 자유 조작/다른 플러그인 탐색 유지 |  |
| Q28 | Shift+2 Fit 참고, 여백 Settings 조절 |  |
| Q29 | 발표 종료 시 현재 카메라/Zoom 유지 |  |
| Q30 | Remote Map에 Canvas 축소 배치+발표 위치·영역·순서 포함 |  |
| Q31 | Order View 3종을 모든 발표 대상에 동일 적용 |  |
| Q32 | Order View는 발표 ON/OFF 독립, 발표 중 표시 가능 |  |
| Q33 | Glow는 현재 발표 대상만 |  |
| Q34 | **최신 결정: Dimming+Blur 모두, 독립 ON/OFF 및 강도 개별 설정** | 과거 Blur 전용 결정을 대체 |
| Q35 | PT Vision과 Order View 각각 독립 토글 | 원본 기획에서 이미 명시 |
| Q36 | Outliner Search에 Collection 포함, 결과 선택 시 트리에서 펼치기 |  |
| Q37 | 여러 Collection에 있는 같은 Item은 결과 하나, 소속 표기 |  |
| Q39 | Heading 단계(H1~H6)와 검색어 조합으로 제목 검색 | 단계만 전체 나열 미포함 |
| Q40 | Line 검색은 실제 텍스트 줄 기준, 여러 줄 일치 시 여러 결과 |  |
| Q41 | 결과 선택 시 해당 Heading/Line의 내부 위치로 이동 | 구현 검증 별도 |
| Q42 | 일치 검색어 임시 Highlight, 원문 수정 금지 |  |
| Q43 | Edge Label은 검색 대상에서 제외 |  |
| Q44 | Image/PDF/YouTube/웹 URL은 기본 이름·제목·URL만. OCR/본문/자막 제외 |  |
| Q45 | 타입 필터 여러 개 동시 선택 가능 |  |
| Q46 | Search 열린 동안 변경된 내용 검색 결과 자동 갱신 |  |
| Q47 | Sidebar/Remote 선택·정렬 공유, 펼침 상태 각각 독립 |  |
| Q48 | 활성 Canvas 전환에 맞춰 Outliner 자동 전환 |  |
| 추가 | Vault 이동/동기화 시 구성 유지, Canvas 복제 시 플러그인 구성도 복제하되 이후 독립 |  |
| 추가 | 동일 Canvas 복수 Pane일 때 마지막 활성 해당 Pane을 제어 |  |
| 추가 | 비활성화·재설치 후 Plugin Data가 남으면 복원, 비활성화로 데이터 삭제 금지 |  |
| 추가 | Windows Desktop 전용 |  |
| 추가 | `.canvas` 원본과 Plugin Data 분리 |  |
| 추가 | 전체 범위 유지하되 1단계 Outliner → 2단계 Presentation → 3단계 Canvas Search |  |
| 추가 | Presentation Group은 원본 `.canvas` Group이 아닌 Plugin Data 전용 영역 |  |

## 원본 기획의 계속 유효한 요구
- Outliner 정렬: 이름/업데이트/생성/크기/Custom.
- Presentation Group 생성: 드래그 영역 / 현재 화면 영역.
- PT Vision 토글; Order View 아이콘/오버레이/복합; Glow; Outside Blind.
- Remote Popup Outliner 및 Presentation List/Map, 전체 Zoom Out 후 영역 클릭 전환, 자유 Canvas 수정.
- Search: Outliner/Canvas 구분, 타입 검색, Heading/Line, Popup.
- Portal은 추후 추가.

## 확정 금지 사항
- 스토리지 파일 구조, 저장 주기, ID 복원 알고리즘, DOM 주입 방법, 영상 링크의 상세 메타데이터 취득 정책을 사용자 결정인 것처럼 간주하지 않는다.
