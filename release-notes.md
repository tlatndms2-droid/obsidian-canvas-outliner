# Canvas Outliner 0.1.54

- Vision Group을 Outliner에서 드래그해 다른 그룹과 순서를 바꾸거나 Collection 안팎으로 옮길 수 있도록 수정했습니다.
- Collection 간 이동, Collection 내부 정렬, Outliner Undo/Redo, Remote Outliner에서도 같은 동작을 지원합니다.
- Vision Group은 계속 하위 카드 없는 단독 항목으로 표시합니다. Canvas에서 일반 그룹 안에 겹쳐 있어도 Outliner의 Collection 소속은 독립적으로 정할 수 있습니다.
- 목록 정렬·Collection 소속 변경은 Canvas의 그룹·카드 위치와 연결을 바꾸지 않습니다.

검증: 자동 테스트 55개 통과. 실제 Sandbox UI의 드래그 이벤트를 통한 정렬·Collection 이동·Undo/Redo·Remote 반영, Canvas 원본 보존 확인. 같은 Sandbox 재시작 후 정렬·소속 유지와 재조작 확인.
