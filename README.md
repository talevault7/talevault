# TaleVault — talevault.mkm.fan

오리지널 단편·연재 소설 무료 연재 사이트(한국어). GitHub Pages 정적 배포.

## 구조
- `index.html` — 홈: 히어로 슬라이드, 최신 이야기 그리드 + 사이드바(장르/최신 업데이트), 지금 읽는 중 미리보기
- `story.html?id=…` — 상세: 표지, 정보, 줄거리, 챕터 목록, 관련 이야기
- `read.html?id=…&ch=…` — 리더: 페이지 모드 / 세로 스크롤, 너비 조절, 이전·다음 화
- `search.html?s=…` — 제목·장르·저자 검색
- `about / privacy / dmca / contact` — 정적 안내 페이지
- `assets/content.json` — 모든 이야기 데이터(제목, 설명, 장르, 챕터 본문)
- `assets/style.json` — 테마(색상, 태그라인, 히어로 슬라이드)
- `assets/ads.json` — 광고 슬롯(기본 꺼짐; AdSense 승인 후 true + 클라이언트 ID)
- `assets/seo.json` — GA4/GSC(관리 패널의 Google/SEO 카드에서 저장)
- `admin/` — 관리 패널(로그인: 사용자명 talevault7 + PAT)

## 배포
1. 이 폴더 전체를 `talevault7/talevault` 리포지토리 root에 업로드
2. Settings → Pages → Source: main / root
3. Custom domain: `talevault.mkm.fan`
4. DNS(CF): CNAME `talevault` → `talevault7.github.io`, 프록시 OFF
5. Pages에서 Enforce HTTPS

## 콘텐츠 추가
`assets/content.json`의 `titles` 배열에 새 항목(id, title, author, description, genres, chapters[{num,title,date,body}])을 추가하고, 표지는 `assets/covers/<id>.jpg`(600×900)로 넣으세요. 관리 패널 UI에서도 동일 작업 가능.
