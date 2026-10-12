# Canvas Outliner — 최종 개발 기획서

## 1. 프로젝트 개요
- 이름: **Canvas Outliner**
- 개발 유형: Obsidian Canvas 확장 플러그인, **Windows Desktop 전용** [확정]
- 목적: Canvas가 커져도 실제 Group을 탐색하고, 가상 Collection으로 의미 기반 분류하며, 발표 대상을 순서화하고, Canvas 전체를 검색한다.
- 사용자: Obsidian Canvas에서 다수의 자료·Group을 관리하고 작업 및 발표하는 개인 사용자.
- 개발 범위: 전체 목표 기능 유지, **1단계 Outliner → 2단계 Presentation → 3단계 Canvas Search** [확정]

## 2. 문제와 목적
기본 Canvas는 공간 배치에는 유용하지만 많은 Group·Card·파일을 계층적으로 탐색하거나 의미별로 재분류하고 순서대로 발표하는 데 추가 관리 수단이 필요하다. Outliner는 실제 Canvas 공간 구조를 보존하면서 가상의 분류와 탐색 경로를 제공한다. Presentation은 슬라이드 생성/편집 제한 모드가 아닌, **기존 Canvas 위에서 정해진 위치로 이동하는 내비게이션**이다.

## 3. 기본 용어 및 구조
- **Canvas 원본**: `.canvas` 안의 실제 Text/File/Link/Group 노드, 연결선, 위치·크기 등.
- **Outliner Space**: 현재 활성 Canvas의 실제 Group 포함 관계 및 수동 등록 일반 Item을 보여주는 트리. Collection을 만들어 분류할 수 있음.
- **Collection**: Canvas 노드가 아닌 Plugin Data 가상 폴더. 여러 단계로 중첩 가능. **Collection 자체는 하나의 상위 Collection에만 소속**; 일반 Canvas Item은 여러 Collection에서 동일 원본을 참조할 수 있음.
- **일반 Group**: 실제 Canvas Group. 생성 시 Outliner 자동 등록. 하위 표시는 실제 Canvas 소속 관계를 따르며 **일반 Item은 사용자가 Outliner Item으로 등록한 것만 표시**.
- **일반 Item**: Card, Markdown, Image, Link, File, YouTube, Site URL, Link Card 등 현재 Canvas의 Node/콘텐츠를 Outliner가 표현한 항목. Portal은 후속.
- **Presentation Space**: 실제 Group 계층과 무관한 발표 순서 목록. 동일 Canvas Item의 복수 순서 등록 가능.
- **Presentation Group**: 실제 Obsidian Group이 아닌 플러그인 전용 Canvas 영역. Item을 묶지 않고 발표 시 보여줄 시야 범위를 지정. 위치·크기·이름·순서 정보는 Plugin Data에 저장. 일반 Outliner에는 나타나지 않고 Presentation Space 전용.
- **Outliner Search**: 등록된 Outliner Item과 Collection, Presentation Space 항목을 검색.
- **Canvas Search**: 등록 여부와 무관하게 현재 Canvas 전체 노드의 검색 가능한 데이터를 검색.

## 4. 핵심 요구사항
### 4.1 Outliner Space [1단계]
- 실제 Group 생성 시 자동 등록·표시. Group 이동, 이름 변경, 실제 포함 관계 변경을 Canvas 기준으로 반영.
- Group 밖의 일반 Item은 기본 미등록. 사용자가 선택하여 `Turn into an Outliner Item` 실행 시 등록. Canvas 다중 선택에 대한 일괄 등록/분류/Presentation 추가 가능.
- `Remove from Outliner`: Outliner 등록과 모든 Collection 참조, 해당 Item을 대상으로 한 **모든** Presentation 등록을 해제하되 실제 Canvas Item을 삭제하지 않음. 참조 제거 영향을 사전에 사용자에게 알려 확인하는 절차를 지원(검증 과정의 보호 요구; 문구/디자인 미확정).
- Collection 생성: Outliner 우클릭 `Make Collection`. Collection 안에 Collection과 등록된 Outliner Item 배치 가능.
- 일반 Canvas Item은 여러 Collection에서 같은 원본을 참조. Collection 자체는 다중 부모 금지, 계층 순환 금지.
- 같은 Group을 Collection에서 볼 때, 일반 Item이 자동으로 전부 노출되지 않음. 일반 Item 표시 자격은 수동 등록 여부에 따름. **Collection별 Group 펼침 상세에 관한 선행 대화의 B안은 'Collection에서는 Group을 하나의 항목으로 표시하고 하위 구조는 펼치지 않는다'로 명시되었으므로 이 규칙을 우선 적용**(Q02). 실제 Group 포함 계층 표시는 기본 Outliner 기준.
- 어떤 Collection/Group에도 속하지 않은 등록 Item은 Outliner 최상위에 바로 표시(자동 `미분류` 폴더 없음).
- Group의 실제 Item 수 / Outliner 등록 Item 수를 `등록 수 / 전체 수`로 표시. 미등록 Item 자체는 나열하지 않음.
- Collection 삭제: 사용자가 **해당 Collection만 삭제(하위 항목 상위로 승격)** 또는 **하위 Collection·참조까지 삭제** 선택. 실제 Canvas 원본은 어떤 경우에도 삭제하지 않음.
- Collection 간 일반 Drag는 기존 소속을 빼고 이동; Ctrl+Drag는 기존 소속 유지하고 추가 참조. 동일 Collection 중복 참조 방지.
- Outliner Drag로 실제 Group 자식 소속을 변경하지 않음. 실제 소속 변경은 Canvas에서 수행, Outliner는 자동 반영.
- Custom 순서 Drag는 `Custom` 모드에서만 허용. 자동 정렬 중에는 순서 Drag 금지(단 Collection 간 이동/추가는 가능).
- 정렬: 이름, 생성시각, 마지막 업데이트, Canvas Node의 가로×세로 면적, Custom. 정렬은 각 계층에서만 적용하며 부모·자식 관계를 깨지 않음. Custom 순서는 다른 정렬 모드와 독립 저장.
- Text Card 기본 이름은 첫 번째 텍스트. 사용자는 **Outliner에 표시되는 이름만 별도 편집** 가능(원본 본문 불변), 수동 이름 해제 시 자동 이름으로 복귀. 표시 이름으로 정렬.
- 생성·업데이트 정렬은 **Canvas Item 개별 생성/수정 시각** 기준(기본 데이터 확보·장기 유지 방식은 검증 대상).
- Outliner에서 Item 선택 → 실제 Canvas 선택과 `Shift+2`에 준하는 Zoom-to-selection 동작 함께 수행. Canvas에서 등록 Item을 선택하면 Outliner에서도 강조. 같은 Canvas가 여러 Pane에 열렸을 때 마지막으로 활성화한 해당 Canvas Pane만 탐색 조작.
- 등록 일반 Canvas Item 우측 상단에 작은 Outliner 상태 아이콘. 기본 ON, 표시 ON/OFF·위치 설정 지원. 다른 플러그인 UI와 중첩 시 가능한 자동 조정과 수동 위치 대체 경로. 기본 Canvas 콘텐츠·조작 방해 금지.
- 일반 Item을 Canvas에서 Ctrl+Drag 복제해도 복제본은 Outliner 미등록·Collection 미승계. Group 복제는 자동 등록.
- Canvas 실제 Group 밖으로 이동한 Item의 **직접 지정 Collection 소속**과 Presentation 등록은 유지. 실제 Group 계층만 갱신.

### 4.2 Presentation [2단계]
- Presentation 공간에는 Outliner 등록된 일반 Item/Group을 넣거나 Canvas에서 직접 `Add to Presentation Space` 실행 가능. 미등록 일반 Item을 바로 추가하면 Outliner 등록도 동시에 수행.
- Collection 자체는 발표 대상이 아님. Collection 내 Canvas Item은 개별/일괄 추가 가능.
- 같은 실제 Canvas Item을 Presentation에 여러 번 추가 가능. 각 순서 자리는 독립된 등록 항목이며 원본 복제 아님.
- Presentation Group 만들기: Canvas에서 영역 Drag / 현재 화면 전체를 영역으로 저장. 생성 후 선택·이동·크기 변경·이름 변경·삭제. Presentation Group끼리/다른 Group·Item과 영역 중첩 가능.
- Presentation Group은 일반 Outliner에 나오지 않으며, Canvas의 실제 Group 포함 관계를 만들지 않는다. PT Vision ON에서 영역 표시 및 편집, OFF에서는 숨김. 별도 OFF 예외 표시 기능 없음.
- Presentation ON/OFF는 **방향키 기반 순서 탐색 활성화**. Presentation View는 독립적인 시각화 설정(발표 OFF에서도 가능).
- 좌우 방향키: `←` 이전, `→` 다음. 첫 번째에서 왼쪽 → 마지막, 마지막에서 오른쪽 → 첫 번째. 텍스트 편집·검색·Popup 등 입력 중에는 기존 방향키 우선; Canvas 탐색 상태에서만 전환.
- 전환 시 현재 대상 전체를 Fit, Obsidian `Shift+2` 화면 맞춤 동작 참고. 사용자 조절 여백 지원. 부드러운 Pan·Zoom 애니메이션.
- 발표 중 Pan/Zoom/Item 선택·수정·Canvas 편집 자유. 다른 플러그인의 탐색·이동 기능도 방해하지 않음. 별도 `Return to Current` 기능 없음. 자유 이동 후 다음 방향키는 **현재 발표 등록 항목 기준**으로 이전/다음 이동.
- 다른 플러그인 이동으로 카메라 위치가 바뀌어도 Presentation 진행 순서는 유지. 발표 종료 시 현재 카메라 위치와 확대율 그대로 유지.
- 발표 중 순서를 재배열해도 **현재 진행 중인 등록 항목** 유지, 이후 이전/다음은 새 순서 기준.
- 삭제된 Canvas Item은 Outliner·Presentation UI에서 숨김. 발표 전환에서는 유효한 대상만 건너뛰어 이동, Ctrl+Z로 복구 시 기존 등록 위치 복귀.
- Presentation View: Order View(작은 아이콘 / 반투명 영역+큰 숫자 / 복합) 모두 **모든 발표 대상**에 적용; 발표 ON/OFF와 독립.
- PT Vision은 Presentation Group의 표시 토글로 Order View와 독립. Glow는 현재 진행 대상만 강조. Outside Blind는 현재 대상 외부의 **어둡게(Dimming)와 흐림(Blur)** 두 효과를 독립 ON/OFF·각 강도 조절 가능. (최신 변경 Q34 우선)
- 전환 방법: 순차 방향키 / Remote Outliner의 Remote Presentation List·Map 직접 선택 / 발표 영역 전체가 보이도록 Zoom Out 후 대상 클릭. Remote Presentation은 발표 ON 시 기본 표시.
- Remote Map은 현재 Canvas의 Item·Group 축소 배치 위에 Presentation 대상의 위치·영역·순서 표시. 클릭 대상 이동.

### 4.3 검색 [Outliner Search는 Outliner 기반, Canvas Search는 3단계]
- Outliner Search: 등록 Item만 검색(미등록 Canvas 일반 Item 제외), Outliner Space와 Presentation Space 범위 분리 지원. Collection 이름 검색 포함. Collection 결과 선택 시 Outliner에서 해당 Collection으로 이동·펼침, Canvas 화면은 움직이지 않음.
- 같은 원본 Item이 여러 Collection에 있으면 검색 결과 **하나**로 합치고 소속 Collection 함께 표시. 실제 Item 결과 선택 시 Canvas에서 선택·Zoom In.
- Canvas Search: 등록 여부와 무관하게 **현재 Canvas의 모든 관련 Node** 검색. 전체 및 여러 타입 필터 동시 선택. Heading 검색은 선택한 H1~H6 단계+검색어가 일치하는 제목만 검색(단계만으로 전체 나열은 미포함). Line 검색은 실제 텍스트 줄 단위, 같은 Item 다중 일치 줄별 독립 결과.
- 검색 결과 선택 → 대상 Canvas Item으로 이동 후 일치 Heading/Line이 보이는 내부 위치까지 이동하고 일치 문자열 일시 강조. 원본 텍스트 수정하지 않음.
- 이미지·PDF·YouTube·웹 URL 등은 파일명·제목·URL처럼 접근 가능한 **기본 텍스트 정보만** 검색. OCR/PDF 본문/영상 자막/웹페이지 본문 검색 제외. Edge Label 검색 제외. Portal 후속.
- Canvas Search Popup이 열려 있는 동안 내용·제목·URL 등 변경 시 결과 자동 갱신.

## 5. 대표 사용자 시나리오
### 시나리오 A — Canvas 구조화
Canvas 열기 → Group 자동 표시 → 필요한 Card 다중 선택 → `Turn into an Outliner Item` → Collection 생성 → Drag 이동 또는 Ctrl+Drag 참조 추가 → Outliner Item 클릭 → 해당 Pane에서 선택 및 자동 Fit → 재실행해도 구조 유지.

### 시나리오 B — 실제 Group 관계 변경
Group A 안 Card A 수동 등록 → Canvas에서 Card A를 Group 밖으로 이동 → Outliner 실제 Group 종속만 해제 → 직접 지정 Collection 소속·Presentation 유지 → 등록 수/실제 수 갱신.

### 시나리오 C — 발표 준비·진행
필요한 Item Presentation에 등록 → 영역이 필요하면 Presentation Group 생성 → 순서 지정(중복 등록 가능) → PT Vision/Order View로 확인 → Presentation ON → 좌우 방향키로 부드럽게 Fit 이동 → 임의 Pan/Zoom 및 다른 플러그인 탐색 → 다음 키로 해당 순서 다음 대상 → 발표 OFF 후 현 화면 유지.

### 시나리오 D — 검색
Canvas Search 열기 → Card+Image 타입 선택 → 검색어 입력 → Heading 단계 또는 Line 검색 → 결과 선택 → 내부 위치 및 일치 단어 Highlight. 검색창이 열려 있는 동안 변경된 카드 내용은 결과 갱신.

### 시나리오 E — 데이터 안전
등록된 Card 삭제 → 목록에서 숨김·참조 임시 보관 → 같은 Canvas 작업 중 Ctrl+Z → 기존 Collection·Presentation 자리 복원. Canvas 닫은 뒤 다시 열면 삭제된 Node의 임시 복구 연결 정보 정리. 같은 내용의 새 Item은 이전 등록 자동 승계 없음.

## 6. UI 구조 및 조작
```
Canvas Outliner
├── Sidebar Outliner
│   ├── Outliner Space
│   └── Presentation Space
├── Remote Outliner (Popup)
│   ├── Outliner
│   └── Remote Presentation
│       ├── List
│       └── Map
├── Canvas Search (별도 Popup)
└── Settings
    ├── Outliner 정렬 / Custom
    ├── Canvas 카드 등록 아이콘 표시·위치
    ├── Presentation View / Order View / PT Vision
    ├── Glow / Outside Blind(Dimming·Blur 각각)
    ├── Presentation Fit 여백 / 전환
    └── 검색·단축키 관련 설정
```
- Sidebar와 Remote는 같은 Outliner 항목 선택·정렬 공유; **각 UI의 Collection·Group 펼침 상태는 독립**.
- 활성 Canvas 전환 시 Outliner가 해당 Canvas로 자동 전환. 같은 Canvas 여러 Pane일 때는 마지막 활성 Pane 사용.
- Remote는 기본 Outliner와 Presentation을 모두 제공하고 Presentation ON 중에는 Remote Presentation 우선 표시.
- 계층 시각화는 반드시 실제 부모/자식 들여쓰기 및 연결선으로 구분하며 Collection의 가상 분류와 실제 Group 포함 관계를 섞지 않는다.

## 7. 데이터·상태·저장
### 7.1 소유 관계
- `.canvas`의 실제 노드/Group/Edge/크기는 Canvas 원본을 유일한 기준으로 취급.
- Collection, 등록 여부, 다중 참조, Custom 순서, Presentation 단계 및 전용 영역은 **별도 Plugin Data**에 저장. Presentation Group이 `.canvas`에 일반 Group으로 추가되지 않음.
- Outliner 이름 사용자 수정은 Plugin Data 표시 이름만 변경. Canvas Card 원문 수정 금지.
- 한 Node가 여러 Collection에 속해도 원본 1개, 참조 여러 개. Presentation에서도 순서별 참조 여러 개.
### 7.2 지속성
- Vault 이동 및 동기화 시 다른 Windows PC에서도 구성 복원.
- 같은 Canvas 파일 이름 변경/이동 시 기존 구성 유지.
- Canvas 파일 **복제** 시 복제 시점의 Outliner·Collection·Presentation 구성 승계하되 이후 원본/복제본 **독립 관리**.
- 플러그인 비활성화만으로 데이터 삭제 금지. 재활성화·재설치 후 기존 Plugin Data가 남아 있으면 복원.
- 삭제된 Canvas Node의 Ctrl+Z 복원을 위한 임시 참조는 **현재 Canvas 작업 중만** 보관, 닫고 다시 열면 정리.
### 7.3 상태
- Canvas 활성 대상, 선택 Item, Outliner 등록 여부, Collection 참조, 정렬 모드/Custom 순서, Presentation ON/OFF, Current Presentation **등록 항목** ID, Order/PT Vision/Glow/Blind 표시 상태, 검색 결과 및 노드 연결 상태.
- 일반 Item `Remove from Outliner` 시 참조 제거 영향 범위는 모든 Collection 및 Presentation 중복 등록 전부 포함. 실제 Canvas 변경 없음.
- Collection 이동·삭제·분류 변경 등 Outliner 작업 Ctrl+Z Undo 지원. Canvas Undo 충돌 방지 검증 필요.

## 8. 예외·실패·복구
| 상황 | 기대 동작 |
|---|---|
| Canvas Node 삭제 | UI에서 숨김, 현재 작업 중 연결 정보 보존, Ctrl+Z 복구 시 원위치 재등록 |
| Ctrl+Z가 아닌 동일 내용 새 Node 생성 | **새 Item**, 이전 참조 강제 승계 금지 |
| 삭제된 Item 포함 Presentation | 유효한 Item만 진행, 순서 순환 유지 |
| Collection 한 곳에서 참조 제거 | 다른 Collection·Presentation 및 Canvas 원본 유지 |
| Collection만 삭제 | 하위 Collection과 참조를 한 단계 위로 유지, Canvas 원본 유지 |
| Collection 하위까지 삭제 | 해당 Collection subtree 및 그 안의 참조 제거, Canvas 원본 및 다른 곳의 참조 유지 |
| Outliner 전체 등록 해제 | 해당 Item의 모든 참조·Presentation 등록 해제, Canvas Node 유지 |
| 여러 Pane에서 동일 Canvas 열기 | 마지막으로 활성화한 해당 Canvas Pane만 화면 이동 |
| 플러그인 데이터가 없는 Canvas | 실제 Group 자동 노출, 일반 Item 미등록, Presentation 비어 있음 |
| 다른 플러그인 UI 겹침 | 가능한 위치 자동 조정, 실패 시 사용자 수동 위치 지정, 상대 플러그인 UI를 임의 변경 금지 |
| 저장·동기화·파일 복제 실패 | 원본 데이터 무손실 우선, 비정상 덮어쓰기 금지, 사용자에게 문제 알림 및 복구 경로 제공 — 구체 UX는 검증/구현에서 상세화 |

## 9. 제약·성능·호환성
- Windows Obsidian Desktop만 1차 지원. macOS/Linux/Android/iOS 현재 개발 범위 제외.
- Pan/Zoom/드래그, 다중 선택, 파일 저장 중 눈에 띄는 지연이나 UI 멈춤을 추가하지 않아야 함.
- 외부 Canvas 플러그인의 이동·Zoom·선택을 가로막지 않음. 자동 카메라 이동 도중 사용자의 직접 조작 우선 및 충돌 방지는 **권장 동작/검증 사항**으로 남김(사용자 미확정 부분을 확정으로 위장 금지).
- Obsidian/JSON Canvas의 최신 실제 지원/API/내부 이벤트/시각화 확장성은 구현 전 검증. 문서상의 기술 가능성을 보장하지 않음.

## 10. 개발 범위
- **1단계** Outliner 기반: Group 자동 등록·동기화, 수동 Item 등록, Collection, 정렬, 선택/탐색, 등록 아이콘, 저장/Undo/복구, Outliner Search의 기반 동작.
- **2단계** Presentation: Presentation Space, 전용 Group, 방향키/순환/중복, 부드러운 Fit, Remote List/Map, View 효과, 다른 플러그인 탐색과 공존.
- **3단계** Canvas Search: 전체/다중 타입/Heading/Line/기본 텍스트, 결과 내부 이동/Highlight/자동 갱신.
- **후속** Portal. 다른 운영체제 지원도 후속 가능성만 기록.
- **제외** 새 `.canvas` 슬라이드 생성, 발표 중 Canvas 편집 잠금, 미등록 일반 Item의 Outliner 자동 표시, Edge Label 검색, OCR/PDF 본문/자막/웹 본문 검색, PT Vision OFF에서 특정 Presentation Group만 임시 표시.

## 11. 완료 조건
세부 수용 테스트는 `03_Phased_Acceptance.md` 참조. 1단계는 Canvas 내용 유지와 분류/저장/Undo 회귀 테스트까지, 2단계는 실제 전환과 자유 조작 공존까지, 3단계는 Heading·Line 결과 정확성과 원문 무변경까지 확인 후 종료한다.

## 12. 미결정·재검토
사용자가 명시적으로 확정하지 않은 **내부 UI 세부/검증 항목**은 `05_Open_Issues.md` 참조. 특히 외부 복제(파일 관리자 등)에서 Plugin Data 복제 가능 여부, Canvas Group 포함 관계, Heading·Line 내부 정확 위치 제어는 기술적으로 검증되지 않았다. 검증 실패 시 사용자 의도 변경 없이 임의 대체하지 말고 영향과 대안을 보고한다.

## 13. 최종 요약
Canvas 원본의 공간 구조 + 가상 Collection 분류 + Canvas 내비게이션형 Presentation + 전체 Canvas Search를 서로 혼동하지 않고 관리한다. 데이터 보존과 시각화 정확성을 우선하며 구현은 단계별로 진행한다.
