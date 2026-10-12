# 개발 단계별 완료 조건 및 테스트 시나리오

> 모든 항목은 **관찰 가능한 결과**로 판단. Obsidian Windows Desktop 실제 Canvas에서 재현하고 실패/예외의 증거를 남긴다. 수치 성능 임계값은 사용자가 확정하지 않았으므로 임의의 합격 수치를 만들지 않는다.

## 공통 게이트
- [ ] 원본 `.canvas` 유실·예상하지 못한 변경 없음.
- [ ] 플러그인 상태가 저장·재시작·Vault 이동 후 요구대로 복원됨.
- [ ] 대형 Canvas에서도 Pan/Zoom/Drag 및 저장이 눈에 띄게 방해받지 않음(정량 계측 병행).
- [ ] 원본 Group / Collection / Presentation Group의 정체성을 혼동하지 않음.
- [ ] 다른 Canvas 확장 플러그인과 기능 충돌 사례와 제한 사항을 보고함.

## 1단계: Outliner 기반
- [ ] Canvas에 Group 생성 → Outliner에 자동 등록, 일반 Card 단독 생성 → 자동 등록되지 않음.
- [ ] 실제 Group에 Card 세 개, 한 개만 등록 → 등록 1/총 3, 하위 표시 한 개.
- [ ] `Turn into an Outliner Item` 다중 등록 → 각 Card 표시, Canvas 원본 내용 불변.
- [ ] Collection/하위 Collection 생성 → 논리 트리로 표시, 실제 Canvas 위치 불변.
- [ ] 같은 Card를 두 Collection에 등록 → 같은 실제 Item을 참조. Collection 자체는 단일 부모.
- [ ] Group 이동/포함 변경 → Outliner 실제 계층 갱신, 직접 지정 Collection 소속 유지.
- [ ] Collection에서 Group 표시 방식이 확정 Q02와 일치하며, 미등록 자식 Item을 노출하지 않음.
- [ ] 일반 Drag → Collection 소속 이동, Ctrl+Drag → 참조 추가. 원본 Canvas Group·좌표 무변경.
- [ ] 이름/개별 생성시각/개별 업데이트/면적/Custom 정렬 → 각 계층 유지, Custom 변경은 Custom 상태에서만.
- [ ] Card 표시 이름 변경 → Canvas Card 텍스트/원본 MD 불변, 정렬에 반영.
- [ ] Outliner Item 클릭 → Canvas 선택 및 전체 Fit, Canvas 선택 → Outliner 선택 반영.
- [ ] Canvas 복제된 일반 Card는 자동 Outliner 등록되지 않음, 복제된 Group은 자동 등록.
- [ ] 등록 아이콘이 우측 상단에 표시·숨김 설정 가능, 타 UI와 겹칠 때 수동 위치 선택 가능.
- [ ] `Remove from Outliner` → 모든 Collection/Presentation 참조 제거, Canvas Node 유지.
- [ ] Collection 단독 삭제 vs subtree 삭제를 선택 가능, 각각 Canvas 원본 유지.
- [ ] Outliner 작업 Ctrl+Z → Collection 이동/분류/삭제 원상 복구.
- [ ] Canvas Node 삭제 시 목록에서 숨김, 현재 작업 중 Undo로 참조 복원, 닫고 다시 열면 임시 삭제 참조 정리.
- [ ] Outliner Search는 등록 Item·Collection 검색, 중복 원본 결과 하나, 선택 시 맞는 위치/Collection 펼침.
- [ ] Canvas 탭 변경 시 해당 Outliner 자동 전환; 동일 Canvas 다중 Pane은 마지막 활성 Pane 제어.
- [ ] Vault 다른 Windows 기기에서 구성 복원 및 Canvas 복제 시 독립 구성 유지.
- [ ] 플러그인 비활성화 후 다시 활성화 시 기존 데이터 유지.

## 2단계: Presentation
- [ ] 일반 Item/Group/전용 Presentation Group을 발표 순서에 등록할 수 있음.
- [ ] 같은 원본 Item을 발표 순서 1과 4에 넣어 각각 이동, 원본 복제 없음.
- [ ] Collection 자체 등록 거부, 안의 등록 Item 일괄 추가 가능.
- [ ] 영역 드래그 및 현재 View를 통한 Presentation Group 생성, 이동·크기·이름·삭제 가능.
- [ ] Presentation Group은 실제 `.canvas` Group을 생성하지 않으며 다른 영역과 중첩 가능.
- [ ] PT Vision OFF에서 전용 Group은 숨김, ON에서 모두 표시·편집.
- [ ] 방향키는 탐색 중만 작동; 텍스트 편집·검색·Popup의 방향키 동작 보존.
- [ ] 방향키 이전/다음 및 양방향 순환, 대상 전체 Fit 및 여백 조절 가능.
- [ ] 부드러운 Pan/Zoom 전환 후 화면 내 대상 전체 표시.
- [ ] 발표 중 자유 Pan/Zoom/선택/수정, 다른 플러그인 이동 사용 가능. 다음 키는 순서 기준 다음 대상.
- [ ] 발표 중 순서를 바꿔도 현재 진행 **등록 항목** 유지.
- [ ] 삭제된 발표 대상은 건너뛰고 Undo 복구 시 원래 순서 회복.
- [ ] 발표 종료 시 카메라 위치와 Zoom 유지.
- [ ] Order View 아이콘/오버레이/복합 모두 일반 Item·Presentation Group 적용; 발표 OFF에서도 가능.
- [ ] Glow는 현재 대상만; Outside Blind의 Dimming/Blur는 독립 ON/OFF·개별 강도.
- [ ] Remote List·Map 전환, Map은 실제 Canvas 축소 배치+발표 영역/순서 표시 및 대상 탐색.
- [ ] 전체 Zoom Out 후 대상 선택 전환 가능.

## 3단계: Canvas Search
- [ ] Outliner 미등록 Item도 검색되며 여러 타입 필터 동시 적용 가능.
- [ ] Heading 수준+검색어가 일치하는 제목 검색; 수준만으로 전체 목록을 자동 내지 않음.
- [ ] Line 검색의 실제 줄마다 결과 하나. 같은 Card 다중 일치 시 별도 결과.
- [ ] 결과 클릭 → Canvas 대상 이동 + 정확한 Heading/Line 내부 위치 + 일치 문자열 임시 강조.
- [ ] Highlight가 Canvas Card/Markdown 원본 텍스트를 변경하지 않음.
- [ ] Image/PDF/YouTube/Web은 가능한 기본 이름·제목·URL만, Edge Label·OCR·PDF 본문·자막·웹 본문 제외.
- [ ] Search Popup 열린 동안 Canvas 텍스트·이름·URL 변경 시 검색 결과 갱신.
- [ ] 대형 Canvas 검색 중 화면 조작 정지 및 원본 손상 없음.

## 테스트 결과 기록 양식
- 테스트 ID / 날짜 / Windows 및 Obsidian 버전 / 테스트 Vault·Canvas / 입력 조작 / 기대 / 실제 / 통과 여부 / 로그·스크린샷 / 관련 이슈 / 재시험.
- 공식 문서로 확인된 사실 / 실제 테스트로 확인된 사실 / 미검증 추정은 별개로 기록.
