# Canvas Outliner 0.1.51

- Vision Group을 추가했습니다. Outliner에는 네 모서리와 눈 모양 아이콘을 가진 단독 항목으로 표시하며, 영역 안 카드를 하위 항목으로 나열하지 않습니다.
- Canvas에서 Ctrl+Shift+드래그한 뒤 메뉴의 Vision Group 만들기를 선택해 생성합니다.
- Obsidian 단축키 설정의 Vision Group 만들기 명령은 선택한 카드가 있으면 감싸고, 없으면 현재 보이는 Canvas 범위를 사용합니다. 기본 키 조합은 지정하지 않습니다.
- Canvas 우측 툴바 눈 아이콘, Outliner의 VG Vision 버튼, VG Vision ON/OFF 명령이 같은 표시 상태를 제어합니다. OFF에서도 카드와 Outliner 항목은 유지되며 PT Vision과는 별개입니다.
- Outliner 항목 클릭으로 영역을 맞춰 보고, 우클릭으로 이름 변경·그룹 삭제를 할 수 있습니다. 그룹 삭제는 원본 카드를 지우지 않으며 Outliner Ctrl+Z로 되돌릴 수 있습니다.

검증: 자동 테스트 50개, Sandbox 생성·표시·아이콘·단축키·검색·이름 변경·삭제·되돌리기 및 같은 Sandbox 재시작 후 그룹과 원본 보존 확인.
성능 사용량 원인 조사·개선은 이번 릴리즈에 포함하지 않았습니다.
