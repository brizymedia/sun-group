# 썬그룹(SUN GROUP by SUN PARTNERS) 리드마그넷 홈페이지

SNS 홍보 → 이 페이지 → 상담 신청으로 이어지는 한 장짜리 사이트.
세 사업(TY 올라이프케어 · 한바이오 SVF 줄기세포 · CIS 보험)과 파트너 모집을 담았다.

```
index.html          대문 한 장 (히어로 → 세 사업 → 썬그룹 → 올라이프케어 → 줄기세포 → 보험 → 파트너 → FAQ → 상담)
assets/style.css    다크 네이비 + 골드 (태양라이프 랜딩 규격), Noto Sans KR + Playfair Display
assets/app.js       메뉴·탭·등장 효과·상담 폼 (외부 라이브러리 없음)
assets/img/         favicon.svg · og.jpg(카톡 미리보기) · AI 생성 사진 10장(webp, Higgsfield Nano Banana 2, 글자 없는 장면만)
_raw/               생성 원본 PNG (gitignore)
```

## 미리보기
`C:/클로드코드2/.claude/launch.json` 의 `sun-group` (포트 8180). 터미널에서는:

```bash
npx -y http-server C:/Users/gilau/Documents/sun-group -p 8180 -c-1
```

## 납품 전에 꼭 확인할 것
1. **연락처** — `assets/app.js` 맨 위 `SMS_TO`(담당자 휴대폰) · `KAKAO`(오픈채팅 주소). 지금은 010-0000-0000 과 단톡방 주소가 임시로 들어 있다.
2. **보험 섹션** — CIS 보험 자료가 오면 `#ins` 의 COMING SOON 상자를 상품 내용으로 바꾼다.
3. **파트너 수당 표** — 사업설명회 자료(UP 8월 18일) 기준. 공개 페이지에 둘지 형님·썬그룹이 결정. 빼려면 `#partner` 의 `.inc` 표와 `.story` 상자만 지우면 된다.
4. **한바이오 수치** — 「해동 생존율 99%」「국내 12번째 허가」「사고 0건」「미국 특허」는 한바이오 발표 기준. 「3~10배」 같은 검증 없는 우월 표현은 교육자료 지침에 따라 뺐다.
5. **시안 띠·noindex** — `<div class="draft">` 와 `<meta name="robots">` 는 확정 뒤 지운다.
6. **og.jpg** — 카톡 미리보기용 그림(1200×630)을 `assets/img/og.jpg` 로 넣는다.
7. **상담 폼 서버** — `FORM_ENDPOINT` 가 비어 있어 폰은 문자 앱, PC 는 복사 안내. Apps Script 주소가 생기면 넣는다.

## 자료 출처 (Desktop\큰길브리지\썬그룹)
- 260812_올라이프케어_교육자료 · _260826_올라이프케어_교육자료_공유용 (TY LIFE)
- 260812_TY올라이프케어_브로슈어 (TY LIFE, 그림 위주)
- All_Life 암검사_영업자용 매뉴얼 · 샘플레포트 (WEAVER)
- 한바이오_SVF교육자료20260720
- UP- 8월 18일 (썬파트너스 사업설명회) · TY_SPECIAL_LIFE_CARE_LIGHT_핵심요약
- 카카오 오픈채팅(g3UAohGi)은 PC 웹에서 열리지 않아 읽지 못했다.
