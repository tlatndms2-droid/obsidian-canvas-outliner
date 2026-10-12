# Canvas Outliner — Planning Pack

대상: Obsidian Canvas용 Windows Desktop 플러그인. **기획 전달용**, 구현 코드 없음.

## 읽는 순서
1. `01_Final_Planning.md` — 사용자 목적, 기능, 사용 흐름, 데이터·상태, 예외, 범위
2. `02_Decision_Register.md` — 최초 기획 및 대화에서 확정한 결정과 구분
3. `03_Phased_Acceptance.md` — 단계별 실행 가능한 완료 조건
4. `04_Codex_Handoff.md` — 기술 검증과 개발 시작 게이트, 금지할 추측
5. `05_Open_Issues.md` — 미검증 사항 및 충돌/불명확 항목

## 확정 vs 검증
- **[확정]** 사용자 명시 결정 또는 최초 기획에 명시된 요구
- **[파생]** 확정 규칙에서 직접 따라오는 결과. 새 독립 기능이 아님
- **[검증]** Codex의 공식 API 및 실제 Windows Obsidian 테스트가 필요한 기술사항
- **[보류]** 원자료에서 한 가지 동작으로 특정할 수 없는 부분. 임의로 구현해 확정하지 말 것

## 구현 순서
1단계 Outliner 기반 → 2단계 Presentation → 3단계 Canvas Search. 각 단계 이전 단계의 데이터 안전을 회귀 검증.

## 주의
원본 `.canvas` 내용, 실제 Group 포함 관계, 사용자 전용 Plugin Data는 서로 다른 데이터이다. 원본을 침범하거나 사용자 결정을 기술 편의상 변경하지 말 것.
