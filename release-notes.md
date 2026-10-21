PT 그룹만 선택하는 모드를 추가했습니다.

- Canvas 상단 및 Remote PT에 ON/OFF 버튼을 추가했습니다. PT Vision이 켜진 편집 화면에서 사용합니다.
- 클릭/Shift+클릭으로 하나 또는 여러 PT 그룹을 선택합니다.
- 드래그 사각형에 일부라도 걸친 그룹을 선택합니다. Shift+드래그는 추가, Alt+드래그는 빼기입니다. 중첩된 PT 그룹도 포함됩니다.
- 선택한 PT 그룹 이름을 잡으면 함께 이동합니다. Delete/Backspace로 선택한 PT 그룹과 연결된 발표 항목만 삭제하며 내부 카드와 일반 Canvas 그룹은 유지합니다.
- Ctrl+Z로 PT 이동·삭제를 되돌립니다. Esc로 드래그 취소 또는 선택 해제합니다.
- 발표 중에는 사용할 수 없습니다. 발표 시작·PT Vision OFF·Canvas 전환·앱 재시작 때 일반 선택 모드로 돌아갑니다.

검증: 타입 검사·빌드·자동 테스트 45개, 재시작 포함 Sandbox UI 검사 33개 통과. 카드 원본 보존과 여러 PT 그룹 이동·삭제·복원, 선택 추가·빼기 및 중첩 영역 처리를 확인했습니다.

BRAT에서 tlatndms2-droid/obsidian-canvas-outliner를 업데이트하세요. 수동 설치는 main.js, manifest.json, styles.css만 교체하고 기존 data.json과 data.backup.json은 유지하세요.
