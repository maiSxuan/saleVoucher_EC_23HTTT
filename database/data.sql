SET session_replication_role = replica;
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
INSERT INTO "public"."hosodn" (
        "ma_hs",
        "ten_dn",
        "ma_so_thue",
        "dia_chi",
        "giay_phep_kinh_doanh",
        "ngay_tao",
        "trang_thai",
        "logo"
    )
VALUES (
        '20000000-0000-0000-0000-000000000001',
        'Ẩm Thực Bốn Phương',
        '0310000001',
        '133/A Đường Nguyễn Huệ, Q1, TPHCM',
        'https://qsbnxxkqosnoomzgjtyp.supabase.co/storage/v1/object/public/partner-documents/licenses/1786626559125_6rk2ic.jpg',
        '2025-10-21 09:34:18.18177+00',
        'Dang hoat dong',
        'https://qsbnxxkqosnoomzgjtyp.supabase.co/storage/v1/object/public/partner-documents/logos/1786626560253_imprmu.png'
    ),
    (
        '20000000-0000-0000-0000-000000000004',
        'Cong ty TNHH Du Lich Thanh Pho',
        '0310000004',
        '10 Pham Ngu Lao, TP. Ho Chi Minh',
        'https://example.local/licenses/du-lich-thanh-pho.pdf',
        '2025-12-10 09:34:18.18177+00',
        'Dang hoat dong',
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D'
    ),
    (
        '20000000-0000-0000-0000-000000000002',
        'Cong ty TNHH Spa An Nhien',
        '0310000002',
        '25 Thanh Thai, TP. Ho Chi Minh',
        'https://example.local/licenses/spa-an-nhien.pdf',
        '2026-07-13 09:34:18.18177+00',
        'Dang hoat dong',
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D'
    ),
    (
        '20000000-0000-0000-0000-000000000003',
        'Cong ty Co phan Giao Duc Tuong Lai',
        '0310000003',
        '80 Vo Van Tan, TP. Ho Chi Minh',
        'https://example.local/licenses/giao-duc-tuong-lai.pdf',
        '2026-06-23 09:34:18.18177+00',
        'Tam khoa',
        'https://images.unsplash.com/photo-1716893917077-5b320c1ecfec?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHNwYSUyMHNlcnZpY2VzfGVufDB8fDB8fHww'
    ),
    (
        'e9359a63-2fa3-43b8-86e2-d3999ca004d2',
        'Tổ Hợp Khu Vui Chơi KidZania Lotte Mall Tây Hồ',
        '0359396447',
        'Tầng 5, Trung tâm thương mại Lotte Mall Hà Nội, số 272 đường Võ Chí Công, phường Tây Hồ, thành phố Hà Nội, Việt Nam',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:04:29+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/ADD-KidZania-Ha-Noi-2_21072026171922.jpg?sign=SS-XdJkfzWpgccljfGP79w'
    ),
    (
        '1f6d328f-c0b0-4676-b4f7-29935641dcea',
        'The Hanoi Train',
        '0392919188',
        'Cửa 1C, sảnh Bắc - Ga Hà Nội - 120 Lê Duẩn - Văn Miếu - Hà Nội',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:04:29+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/ADD-5-cua-o-1_17072026120043.jpg?sign=H3u_SI-kRDW-4rXNwfCzwg'
    ),
    (
        '2a0f71ae-512d-492c-80c3-53d9180fe5af',
        'Sâu Kid Playground',
        '0327085749',
        'Tầng 3, Lô 05-06-07 toà ROX Center Goldmark City, 136 Hồ Tùng Mậu, Bắc Từ Liêm, Hà Nội',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:04:29+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/ADD-Sau-kid-Playground-2_14072026105244.jpg?sign=tEqpkAhovxPH1Wr0VdIsMg'
    ),
    (
        '4372b404-c218-4eb7-bcb6-c1089a94624b',
        'kidzooona AEON MALL Hải Phòng 3F',
        '0347509241',
        'Lô T347-348, tầng 3, Aeon Mall Hải Phòng Lê Chân, Đ. Hồ Sen Cầu Rào 2, phường An Biên, thành phố Hải Phòng',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:04:29+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/ADD-kidzooona-Hai-Phong_14072026172432.jpg?sign=mz1ehr85fB7VefDj-6Kg_w'
    ),
    (
        '0bb45dbd-d123-48e3-b019-bebbe4939c5d',
        'Show Thực Cảnh Anh Hùng Cờ Lau',
        '0310928727',
        'Thủy Đình, Phố Cổ Hoa Lư, Ninh Bình',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:04:29+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/ADD-Anh-hung-co-lau-01_09072026113202.jpg?sign=4KDlzuWYSeA2LeMGvoKmJA'
    ),
    (
        '1c515879-c33a-4175-af65-f74c5034ca13',
        'Kid''s Box Vincom Royal Island Hải Phòng',
        '0340753220',
        'Lô L3-16, tầng L3, Tòa nhà Vincom Mega Mall Royal Island thuộc lô CCĐT-01, Khu B1, Khu vui chơi giải trí, nhà ở và công viên sinh thái đảo Vũ Yên, Phường Thủy Nguyên, TP. Hải Phòng, VN',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:04:29+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/ADD-Kidzooona-2_07072026090658.jpg?sign=iZhpYcVAdS5bVfcpVvHDVg'
    ),
    (
        '7a296d86-e092-4453-b4bd-725b169aee4d',
        'kidzooona AEON MALL Hải Phòng 2F',
        '0392496460',
        'Lô T264, tầng 2, Aeon Mall Hải Phòng Lê Chân, Đ. Hồ Sen Cầu Rào 2, phường An Biên, thành phố Hải Phòng.',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:04:29+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/ADD-Kidzooona-3_07072026090605.jpg?sign=T1impM_63xbzuvOFOJDPmQ'
    ),
    (
        '0f44c4e9-2b55-4a43-88c8-e51bc848ab1a',
        'kidzooona Hanoi Centre',
        '0331987936',
        'L2-C10, Tầng 2, Tiến Bộ Plaza, 175 đường Nguyễn Thái Học, Phường Ô Chợ Dừa, TP. Hà Nội',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:04:29+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/ADD-Kidzooona-6_07072026085006.jpg?sign=uqAO43sJUYhZ-85GUfLmrQ'
    ),
    (
        '5b61f219-490e-4265-b3d1-1ba7728af1ea',
        'Tiny kidzooona AEON MALL Long Biên',
        '0377741378',
        'Lô 3F-1, tầng 3, Aeon Mall Long Biên, Số 27 đường Cổ Linh, Phường Long Biên, Thành phố Hà Nội, Việt Nam',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:04:29+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/ADD-Kidzooona-1_06072026165845.jpg?sign=i7-Ey0BBpih6FtzHeLkWvg'
    ),
    (
        '440cc5c3-dbe3-4d65-b735-10b04b2987c3',
        'kidzooona AEON MALL Long Biên',
        '0398242877',
        'Lô T334-1, tầng 3, Aeon Mall Long Biên, Số 27 đường Cổ Linh, Phường Long Biên, Thành phố Hà Nội, Việt Nam',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:04:29+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/ADD-Kidzooona-7_06072026163043.jpg?sign=Rx5hKRvQQyz0jnQDCylKwA'
    ),
    (
        'c57b538e-359a-4a01-a56c-da54a70db1d1',
        'Kid''s Box LOTTE MART Vinh',
        '0334595937',
        'Lô 3F-11, TTTM Lotte Mart, Đại lộ V.I.Lenin, Khối Yên Sơn, Phường Vinh Phú, Tỉnh Nghệ An, Việt Nam',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:04:29+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/ADD-Kidzooona-4_06072026172549.jpg?sign=Pw9eUnLolHcg4VF7QbsdkA'
    ),
    (
        'c6d185d3-3b89-4331-85a6-bd718342e9e1',
        'kidzooona GO Buôn Ma Thuột',
        '0309571459',
        'Lô 2S22-B, TTTM Go! Buôn Ma Thuột, Góc đường Nguyễn Thị Định và đường Vành đai Phía Tây, Phường Thành Nhất, Tỉnh Đắk Lắk, Việt Nam',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:04:29+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/ADD-Kidzooona-3_06072026160832.jpg?sign=KF5EVS8-miOznWH8E82sYw'
    ),
    (
        '15ad6191-778f-4a62-95b2-97a5bdaf18f0',
        'kidzooona AEON MALL Tân Phú Celadon',
        '0390987539',
        'Lô S19, Tầng 2, AEON Mall Tân Phú Celadon, Số 30, Bờ Bao Tân Thắng, Phường Tân Sơn Nhì, Tp.HCM',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:04:29+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/ADD-Kidzooona-1_06072026154902.jpg?sign=CkR-bMmWjwBEJgipjwQlyQ'
    ),
    (
        'd69ba734-c3f9-4813-be9f-d1d83d7ec45c',
        'kidzooona PARC MALL Quận 8',
        '0387280169',
        'L3-01, Tầng 3, Trung tâm thương mại PARC MALL Q.8, số 547-549 đường Tạ Quang Bửu, Phường Chánh Hưng, TP.HCM',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:04:29+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/ADD-Kizooona-6_06072026150831.jpg?sign=ao45DOy-mfl3KWvnCFMjZA'
    ),
    (
        '97cc13f3-9e0f-44d3-93a8-d8725e4fab06',
        'I.CAN INTERNATIONAL',
        '0313861648',
        'Số 10 ngõ 102 Trần Phú,Hà Đông, Hà Nội',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:07:50+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/ADD-Trang-Binh-An_21082026103954.jpg?sign=tPZbZy5LIFs6OXjbrWkciQ'
    ),
    (
        'da49801a-ad11-4e33-9dc1-9919589faf11',
        'Nhà hàng Chay Tầm Vị',
        '0346965649',
        '50B Phố Châu Long, Phường Ba Đình, Hà Nội',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:07:50+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/ADD-Chay-Tam-Vi_12082026142301.jpg?sign=5x9dQFK6ItK4PE_RVVSr9g'
    ),
    (
        '32da8e0d-0142-41da-b6b7-172fa52dc131',
        'GIVISTA',
        '0375979427',
        'Địa điểm tư vấn mua voucher: Tầng 8, Tòa nhà Phương Nam, Số 157 Võ Thị Sáu, Phường 6, Quận 3, TP. HCM',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:07:50+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/ADD-Moonlit-Harmony-4banh_11082026101508.jpg?sign=-gN17MPFZfnwx7p-_PfCHg'
    ),
    (
        'e8acc2e0-6d3e-4b9f-8e28-78e11edc73e7',
        'Hệ thống Phòng khám DiaB',
        '0344224527',
        'Phòng A301 - Tầng 3A - 71 Hoàng Văn Thái, Phường Tân Mỹ, TP.HCM',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:09:44+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/Voucher-mien-phi-kham_04082026091222.png?sign=sEbiRhkn4QFev_MWIB4hpw'
    ),
    (
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        'Hệ thống Thẩm mỹ viện Ngọc Dung',
        '0321152664',
        '392A Nguyễn Thị Thập, P.Tân Quy, Q.7, HCM',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:09:44+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/ADD-TMV-Ngoc-Dung-1_27052026142721.jpg?sign=kF7mR8MZomN_Dml8rHMXNw'
    ),
    (
        'a15af6ae-5802-4568-9e30-cf6e238bd336',
        'SEN 20 HÀNG TRE VÀ 72B TRẦN HƯNG ĐẠO',
        '0330675411',
        'Số 20 Hàng Tre, Phường Lý Thái Tổ, Quận Hoàn Kiếm, Thành phố Hà Nội',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:09:44+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/Sen-Tai-Thu-14_11052026115055.jpg?sign=rQtoCt2tZprws9CdaSAKpg'
    ),
    (
        'e9785604-dd4f-4067-8d07-3396c5af9c34',
        'Aurora Halong Cruises',
        '0340929098',
        'Cảng tàu Quốc tế Hạ Long - Hạ Long - Quảng Ninh',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:10:24+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/1_27052026115347.jpg?sign=HtSwInTcSNqP17pCCYhpeQ'
    ),
    (
        '5f149f7c-2bc3-4730-bcdd-2eb755ee6513',
        'DuYen Cruise',
        '0381950186',
        'Nhà chờ G55, cảng số 2, Cảng tàu Quốc tế Tuần Châu - Quảng Ninh',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:10:24+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/Lily-Cruise_27052026143448.jpg?sign=K5f9MTd7cSVawfScSz5Iaw'
    ),
    (
        '982c92d0-7f3f-4d5c-9af6-69ff021c5347',
        'Ruby Cruise',
        '0307809070',
        'Nhà chờ G55, cảng số 2, Cảng tàu Quốc tế Tuần Châu - Quảng Ninh',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:10:24+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/Ruby-Cruise-1_20052026170653.jpg?sign=8UUtGuXRoUXoBjsTEWINFQ'
    ),
    (
        'b45bd7b0-c853-42b4-8df6-678e74dcdabf',
        'Airport Connects',
        '0392533230',
        'Địa điểm tư vấn mua voucher: Số 122 Nguyễn Hoàng, phường Bình Trưng, TP.Hồ Chí Minh',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:10:24+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/1_14052026091932.jpg?sign=BbYtKahe5EIcHe5iCsRHZQ'
    ),
    (
        '195ea851-59dd-4e70-ad76-71d0ea76db64',
        'Fast Lane - Consortio',
        '0319220185',
        'Cảng hàng không quốc tế Phú Quốc Đặc khu Tổ 2, Khu phố, Phú Quốc, An Giang',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:10:24+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/Evisa-Dich-vu-ho-tro-lay-thi-thuc-Online_30062026111126.jpg?sign=mkAyfZGyM6KX8Lxp1k1znA'
    ),
    (
        '57300452-7745-419b-90f4-9e8d2a07bc3f',
        'Sân bay Quốc tế Cam Ranh CIAS',
        '0323469876',
        'Địa điểm sử dụng: Phòng chờ The Champ Lounge - Tầng 2 -  Ga quốc nội cảng HKQT Cam Ranh (gần cửa số 6)',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:10:24+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/the-champ-lounge_13052026112143.jpg?sign=f3355DouEEZWGXgYgLed8w'
    ),
    (
        'f7d08df4-04db-4d5a-859f-70ccf5e5e2dd',
        'Potico.vn - Hoa & Quà Tặng',
        '0395159178',
        'Hồ Chí Minh: Số 122 Nguyễn Hoàng, phường Bình Trưng, TP.Hồ Chí Minh',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:12:55+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/Coupon-giam-100k-cho-don-hang_10062026085836.jpg?sign=m1NqrKCkwBob-Zpybi_RCQ'
    ),
    (
        'ab0eb565-e8ad-4b0e-b2f4-cba3521d0411',
        'bTaskee - Ứng dụng tiện ích gia đình',
        '0377712792',
        'Địa điểm tư vấn mua Voucher: Tầng 12A Tòa văn phòng - TTTM ROX Tower Goldmark City 136 Hồ Tùng Mậu, Phú Diễn, Hà Nội',
        'https://ketoananpha.vn/uploads/images/post/36-moi/Phan-biet-giay-phep-kinh-doanh-va-giay-chung-nhan-dang-ky-doanh-nghiep-03.jpg',
        '2026-08-24 16:12:55+00',
        'Dang hoat dong',
        '//cdn.lifelink.vn/img/c280x280/ADD-bTaskee_27052026090638.jpg?sign=40od9hV7RZFoZkgJVr5DjA'
    );
--
-- Data for Name: chinhanh; Type: TABLE DATA; Schema: public; Owner: postgres
--
INSERT INTO "public"."chinhanh" (
        "ma_chi_nhanh",
        "ten_chi_nhanh",
        "dia_chi",
        "trang_thai",
        "ma_hs",
        "khu_vuc"
    )
VALUES (
        'c043a95b-f062-4ab3-8aea-f920d77b5586',
        'Tổ Hợp Khu vui chơi KidZania Lotte Mall Tây Hồ',
        'Tầng 5, Trung tâm thương mại Lotte Mall Hà Nội, số 272 đường Võ Chí Công, phường Tây Hồ, thành phố Hà Nội, Việt Nam',
        'Dang hoat dong',
        'e9359a63-2fa3-43b8-86e2-d3999ca004d2',
        'Hà Nội'
    ),
    (
        '4385a7ab-71bd-4e38-be6f-020bd45e9e83',
        'The Hanoi Train',
        'Cửa 1C, sảnh Bắc - Ga Hà Nội - 120 Lê Duẩn - Văn Miếu - Hà Nội',
        'Dang hoat dong',
        '1f6d328f-c0b0-4676-b4f7-29935641dcea',
        'Hà Nội'
    ),
    (
        '67d99e9d-67db-4a66-b6b0-ee2fb1bd5b16',
        'SÂU KID Playground',
        'Tầng 3, Lô 05-06-07 toà ROX Center Goldmark City, 136 Hồ Tùng Mậu, Bắc Từ Liêm, Hà Nội',
        'Dang hoat dong',
        '2a0f71ae-512d-492c-80c3-53d9180fe5af',
        'Hà Nội'
    ),
    (
        '4ac4c2af-97b4-4e1a-8906-799dd168729c',
        'kidzooona AEON MALL Hải Phòng 3F',
        'Lô T347-348, tầng 3, Aeon Mall Hải Phòng Lê Chân, Đ. Hồ Sen Cầu Rào 2, phường An Biên, thành phố Hải Phòng',
        'Dang hoat dong',
        '4372b404-c218-4eb7-bcb6-c1089a94624b',
        'Hải Phòng'
    ),
    (
        '2daf1ab0-ccc9-4c8e-9074-46482bfed73d',
        'Show Thực cảnh Anh Hùng Cờ Lau',
        'Thủy Đình, Phố Cổ Hoa Lư, Ninh Bình',
        'Dang hoat dong',
        '0bb45dbd-d123-48e3-b019-bebbe4939c5d',
        'Ninh Bình'
    ),
    (
        '3ca81d95-0e02-43f0-9874-c9e461c684f2',
        'Kid''s Box Vincom Royal Island Hải Phòng',
        'Lô L3-16, tầng L3, Tòa nhà Vincom Mega Mall Royal Island thuộc lô CCĐT-01, Khu B1, Khu vui chơi giải trí, nhà ở và công viên sinh thái đảo Vũ Yên, Phường Thủy Nguyên, TP. Hải Phòng, VN',
        'Dang hoat dong',
        '1c515879-c33a-4175-af65-f74c5034ca13',
        'Hải Phòng'
    ),
    (
        '3d90d84b-d204-4513-b8de-f5d33bb39b8e',
        'kidzooona AEON MALL Hải Phòng Tầng 2',
        'Lô T264, tầng 2, Aeon Mall Hải Phòng Lê Chân, Đ. Hồ Sen Cầu Rào 2, phường An Biên, thành phố Hải Phòng.',
        'Dang hoat dong',
        '7a296d86-e092-4453-b4bd-725b169aee4d',
        'Hải Phòng'
    ),
    (
        'af3d771a-93f6-4757-a8e8-26bc5a3d4d52',
        'kidzooona Hanoi Centre',
        'L2-C10, Tầng 2, Tiến Bộ Plaza, 175 đường Nguyễn Thái Học, Phường Ô Chợ Dừa, TP. Hà Nội',
        'Dang hoat dong',
        '0f44c4e9-2b55-4a43-88c8-e51bc848ab1a',
        'Hà Nội'
    ),
    (
        'ea438d89-21bf-4c6c-a3da-6edcd640a25a',
        'Tiny kidzooona AEON MALL Long Biên',
        'Lô 3F-1, tầng 3, Aeon Mall Long Biên, Số 27 đường Cổ Linh, Phường Long Biên, Thành phố Hà Nội, Việt Nam',
        'Dang hoat dong',
        '5b61f219-490e-4265-b3d1-1ba7728af1ea',
        'Hà Nội'
    ),
    (
        'cd2c959c-72c2-4667-9436-646981ed6324',
        'kidzooona AEON MALL Long Biên',
        'Lô T334-1, tầng 3, Aeon Mall Long Biên, Số 27 đường Cổ Linh, Phường Long Biên, Thành phố Hà Nội, Việt Nam',
        'Dang hoat dong',
        '440cc5c3-dbe3-4d65-b735-10b04b2987c3',
        'Hà Nội'
    ),
    (
        '99cd1020-4eec-42a8-8596-0f89081f268c',
        'Kid''s Box LOTTE MART Vinh',
        'Lô 3F-11, TTTM Lotte Mart, Đại lộ V.I.Lenin, Khối Yên Sơn, Phường Vinh Phú, Tỉnh Nghệ An, Việt Nam',
        'Dang hoat dong',
        'c57b538e-359a-4a01-a56c-da54a70db1d1',
        'Nghệ An'
    ),
    (
        '9cb249b9-8a3a-42ca-9f32-b2a2677d5202',
        'kidzooona GO Buôn Ma Thuột',
        'Lô 2S22-B, TTTM Go! Buôn Ma Thuột, Góc đường Nguyễn Thị Định và đường Vành đai Phía Tây, Phường Thành Nhất, Tỉnh Đắk Lắk, Việt Nam',
        'Dang hoat dong',
        'c6d185d3-3b89-4331-85a6-bd718342e9e1',
        'Đắk Lắk'
    ),
    (
        '0c18e4d3-575b-42d8-aa29-aa0588035623',
        'kidzooona AEON MALL Tân Phú Celadon',
        'Lô S19, Tầng 2, AEON Mall Tân Phú Celadon, Số 30, Bờ Bao Tân Thắng, Phường Tân Sơn Nhì, Tp.HCM',
        'Dang hoat dong',
        '15ad6191-778f-4a62-95b2-97a5bdaf18f0',
        'Hồ Chí Minh'
    ),
    (
        '13853bf1-f776-4309-9bf5-a8c1162b59bd',
        'kidzooona PARC MALL Quận 8',
        'L3-01, Tầng 3, Trung tâm thương mại PARC MALL Q.8, số 547-549 đường Tạ Quang Bửu, Phường Chánh Hưng, TP.HCM',
        'Dang hoat dong',
        'd69ba734-c3f9-4813-be9f-d1d83d7ec45c',
        'Hồ Chí Minh'
    ),
    (
        'b01bbe8f-c041-4305-901c-ce6d71c3977a',
        'CÔNG TY TNHH I.CAN INTERNATIONAL',
        'Số 10 ngõ 102 Trần Phú,Hà Đông, Hà Nội',
        'Dang hoat dong',
        '97cc13f3-9e0f-44d3-93a8-d8725e4fab06',
        'Hà Nội'
    ),
    (
        'bf5113ae-8d82-4bd1-9370-3be8c97f45c3',
        'Nhà hàng Chay Tầm Vị',
        '50B Phố Châu Long, Phường Ba Đình, Hà Nội',
        'Dang hoat dong',
        'da49801a-ad11-4e33-9dc1-9919589faf11',
        'Hà Nội'
    ),
    (
        '23fa6b3d-0b8c-4789-a3b2-6fea23706eb4',
        'Dealtoday HCM',
        'Địa điểm tư vấn mua voucher: Tầng 8, Tòa nhà Phương Nam, Số 157 Võ Thị Sáu, Phường 6, Quận 3, TP. HCM',
        'Dang hoat dong',
        '32da8e0d-0142-41da-b6b7-172fa52dc131',
        'Hồ Chí Minh'
    ),
    (
        '5c734a85-77ca-4b26-aa6f-0c763f527ad5',
        'GIVISTA',
        '251/16D Vườn Lài, P. An Phú Đông, TP.HCM',
        'Dang hoat dong',
        '32da8e0d-0142-41da-b6b7-172fa52dc131',
        'Hồ Chí Minh'
    ),
    (
        '54942b07-4261-4a98-8faa-493d3806019b',
        'Phòng khám DYM',
        'Phòng A301 - Tầng 3A - 71 Hoàng Văn Thái, Phường Tân Mỹ, TP.HCM',
        'Dang hoat dong',
        'e8acc2e0-6d3e-4b9f-8e28-78e11edc73e7',
        'Hồ Chí Minh'
    ),
    (
        '50a22950-f1ae-4a59-963c-e87221c056ce',
        'Phòng khám Bewell',
        'Tầng 3-3A Somerset Vista - 628C Võ Nguyên Giáp, Phường An Khánh, TP.HCM',
        'Dang hoat dong',
        'e8acc2e0-6d3e-4b9f-8e28-78e11edc73e7',
        'Hồ Chí Minh'
    ),
    (
        '32c0d1f9-40a5-4191-a7f8-5124c4657c54',
        'Phòng khám Medamour',
        '33C Lê Thánh Tôn, Phường Sài Gòn, TP.HCM',
        'Dang hoat dong',
        'e8acc2e0-6d3e-4b9f-8e28-78e11edc73e7',
        'Hồ Chí Minh'
    ),
    (
        'f842ec56-5095-49d4-9e6a-4107fbdc1ef1',
        'Phòng khám Sun Avenue',
        '114 Đường 51, Phường Bình Trưng, TP.HCM',
        'Dang hoat dong',
        'e8acc2e0-6d3e-4b9f-8e28-78e11edc73e7',
        'Hồ Chí Minh'
    ),
    (
        'a6483cb2-b3f1-45c1-a47b-49b28f4c5383',
        'TMV Ngọc Dung_Nguyễn Thị Thập Q7',
        '392A Nguyễn Thị Thập, P.Tân Quy, Q.7, HCM',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        'Hồ Chí Minh'
    ),
    (
        '707c001c-c440-4b4c-9717-e789750eda65',
        'TMV Ngọc Dung_Ba tháng Hai Q10',
        '32-34-36 Đường 3/2, P.12, Q.10, HCM',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        'Hồ Chí Minh'
    ),
    (
        '908e6544-7bb0-498e-83d0-58eb663232a6',
        'Hệ thống Thẩm mỹ viện Ngọc Dung_Nguyễn Bỉnh Khiêm Q1',
        '33C - 33D - 33E Nguyễn Bỉnh Khiêm, Phường Sài Gòn, Thành phố Hồ Chí Minh, Việt Nam',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        'Hồ Chí Minh'
    ),
    (
        'c220ea31-ca4e-467a-9721-4d7655dabcf8',
        'Hệ thống Thẩm mỹ viện Ngọc Dung_392A Nguyễn Thị Thập',
        '392A Nguyễn Thị Thập, Phường Tân Hưng,Thành phố Hồ Chí Minh, Việt Nam',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        'Hồ Chí Minh'
    ),
    (
        '62db2bfa-3a21-4dfd-88ae-55204b8c8db0',
        'Hệ thống Thẩm mỹ viện Ngọc Dung_32 - 34 - 36 Đường Ba Tháng Hai',
        'Số 32 - 34 - 36 Đường Ba Tháng Hai, Phường Hòa Hưng, Thành phố Hồ Chí Minh, Việt Nam',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        'Hồ Chí Minh'
    ),
    (
        '96841a89-aca2-4d5e-a2b3-08f713ccce13',
        'Hệ thống Thẩm mỹ viện Ngọc Dung_464 - 466 Đại lộ Bình Dương',
        'Số 464 - 466 Đại lộ Bình Dương, Tổ 13, KP1, Phường Phú Lợi, Thành phố Hồ Chí Minh, Việt Nam',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        'Hồ Chí Minh'
    ),
    (
        '7f57733d-1884-4193-953b-faa801da146c',
        'Hệ thống Thẩm mỹ viện Ngọc Dung_Số 157 Nam Kỳ Khởi Nghĩa',
        'Số 157 Nam Kỳ Khởi Nghĩa, Phường Vũng Tàu, Thành phố Hồ Chí Minh, Việt Nam',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        'Hồ Chí Minh'
    ),
    (
        '58bb7b68-cc5a-4de4-8c0b-52be3801b5f9',
        'TMV Ngọc Dung_Thủ dầu một BD',
        '464 - 466 Đại Lộ Bình Dương, P. Hiệp Thành, Tp. Thủ Dầu Một, Bình Dương',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        'Bình Dương'
    ),
    (
        '89d80f0c-3920-459b-aeb4-486e4dd8dac1',
        'SEN 20 HÀNG TRE',
        'Số 20 Hàng Tre, Phường Lý Thái Tổ, Quận Hoàn Kiếm, Thành phố Hà Nội',
        'Dang hoat dong',
        'a15af6ae-5802-4568-9e30-cf6e238bd336',
        'Hà Nội'
    ),
    (
        '656e341e-280d-408b-b0c4-daddfad429e7',
        'SEN 72B TRẦN HƯNG ĐẠO',
        '72B phố Trần Hưng Đạo, phường Trần Hưng Đạo, Quận Hoàn Kiếm, TP Hà Nội',
        'Dang hoat dong',
        'a15af6ae-5802-4568-9e30-cf6e238bd336',
        'Hà Nội'
    ),
    (
        '30000000-0000-0000-0000-000000000004',
        'Spa An Nhien - Thanh Thai',
        '25 Thanh Thai, TP. Ho Chi Minh',
        'Dang hoat dong',
        '20000000-0000-0000-0000-000000000002',
        'TP. Hồ Chí Minh'
    ),
    (
        '30000000-0000-0000-0000-000000000002',
        'Am Thuc Sai Gon - Vo Van Tan',
        '120 Vo Van Tan, TP. Ho Chi Minh',
        'Dang hoat dong',
        '20000000-0000-0000-0000-000000000001',
        'TP. Hồ Chí Minh'
    ),
    (
        '2d5617a6-f948-437e-9bd7-ae70f5d7ff61',
        'Ẩm thực Chi nhánh Cầu Ông Lãnh',
        '137 Cầu Ông Lãnh',
        'Dang hoat dong',
        '20000000-0000-0000-0000-000000000001',
        'TP. Hồ Chí Minh'
    ),
    (
        'b06d0a13-2307-468f-85bd-cea2627dc564',
        'Aurora Halong Cruise',
        'Cảng tàu Quốc tế Hạ Long - Hạ Long - Quảng Ninh',
        'Dang hoat dong',
        'e9785604-dd4f-4067-8d07-3396c5af9c34',
        'Quảng Ninh'
    ),
    (
        '8ad58563-6e4c-4e8b-acc8-1ba9aeaff128',
        'LiLy Cruise',
        'Nhà chờ G55, cảng số 2, Cảng tàu Quốc tế Tuần Châu - Quảng Ninh',
        'Dang hoat dong',
        '5f149f7c-2bc3-4730-bcdd-2eb755ee6513',
        'Quảng Ninh'
    ),
    (
        '0c363009-a091-4f2f-857a-a1ca92edd207',
        'DuYen Cruise',
        'Nhà chờ G55, cảng số 2, Cảng tàu Quốc tế Tuần Châu - Quảng Ninh',
        'Dang hoat dong',
        '5f149f7c-2bc3-4730-bcdd-2eb755ee6513',
        'Quảng Ninh'
    ),
    (
        '1b611a6a-c9e1-438b-be51-01358f202b2f',
        'Ruby Cruise',
        'Nhà chờ G55, cảng số 2, Cảng tàu Quốc tế Tuần Châu - Quảng Ninh',
        'Dang hoat dong',
        '982c92d0-7f3f-4d5c-9af6-69ff021c5347',
        'Quảng Ninh'
    ),
    (
        'ea457754-0a9a-4170-82a4-10c904e104c1',
        'LifeLink Hồ Chí Minh',
        'Địa điểm tư vấn mua voucher: Số 122 Nguyễn Hoàng, phường Bình Trưng, TP.Hồ Chí Minh',
        'Dang hoat dong',
        'b45bd7b0-c853-42b4-8df6-678e74dcdabf',
        'Hồ Chí Minh'
    ),
    (
        '42617154-118b-4427-bbec-4ce3436c022a',
        'SH Premium Lounge Con Dao - Ga đi Quốc nội - Sân Bay Côn Đảo - Bà Rịa Vũng Tàu',
        'Tầng 1, cạnh cửa khởi hành số 1, Khu cách ly Ga đi Quốc nội, CHK Côn Đảo.',
        'Dang hoat dong',
        'b45bd7b0-c853-42b4-8df6-678e74dcdabf',
        'Hồ Chí Minh'
    ),
    (
        '6254b323-5a50-4b9d-97b8-c4d50371d70d',
        'Jasmine Halal Lounge - Ga đi Quốc tế - Sân Bay Tân Sơn Nhất',
        'Tầng 2, Khu cách ly Quốc Tế, Ga Quốc Tế, Sân Bay Quốc tế Tân Sơn Nhất',
        'Dang hoat dong',
        'b45bd7b0-c853-42b4-8df6-678e74dcdabf',
        'Hồ Chí Minh'
    ),
    (
        '88d9c6c7-5a90-4349-b6ce-7434fba39f54',
        'Apricot Business Lounge - Ga đi Quốc tế T2 - Sân Bay Tân Sơn Nhất',
        'Khu cách ly Ga đi Quốc tế T2, Sân bay quốc tế Tân Sơn Nhất, TP. Hồ Chí Minh',
        'Dang hoat dong',
        'b45bd7b0-c853-42b4-8df6-678e74dcdabf',
        'Hồ Chí Minh'
    ),
    (
        '5dff71ab-b046-4fb0-b948-45f563a32592',
        'SH Premium Lounge Tan Son Nhat - Ga đi Quốc nội - Sân Bay Tân Sơn Nhất',
        'Tầng 4, Khu cách ly Quốc nội, Nhà ga T3, Cảng HKQT Tân Sơn Nhất',
        'Dang hoat dong',
        'b45bd7b0-c853-42b4-8df6-678e74dcdabf',
        'Hồ Chí Minh'
    ),
    (
        'c8395dd8-e715-4bd4-ba7b-263661a1a0d9',
        'Le Saigonnais Lounge Tan Son Nhat - Ga đi Quốc nội - Sân Bay Tân Sơn Nhất',
        'Tầng 2, Khu cách ly Quốc nội, Cảng HKQT Tân Sơn Nhất (đối diện cửa ra tàu bay số 12)',
        'Dang hoat dong',
        'b45bd7b0-c853-42b4-8df6-678e74dcdabf',
        'Hồ Chí Minh'
    ),
    (
        '8a5ba525-f70d-448e-b43e-cd2d06c19cc1',
        'LifeLink Hà Nội',
        'Địa điểm tư vấn mua voucher: Tầng 12A Tòa văn phòng - TTTM ROX Tower Goldmark City 136 Hồ Tùng Mậu, phường Phú Diễn, Hà Nội',
        'Dang hoat dong',
        'b45bd7b0-c853-42b4-8df6-678e74dcdabf',
        'Hà Nội'
    ),
    (
        '935e330a-a7bd-4307-aec3-256f94832085',
        'SH Premium Lounge Ha Noi 1 - Ga đi Quốc nội - Sân Bay Nội Bài - Hà Nội',
        'Tầng 3, Khu cách ly Quốc nội, Cảng HKQT Nội Bài (Gần cửa ra tàu bay số 4 và 9)',
        'Dang hoat dong',
        'b45bd7b0-c853-42b4-8df6-678e74dcdabf',
        'Hà Nội'
    ),
    (
        '1d224a41-2eb4-4db0-a8e4-14bdb8c45051',
        'SH Premium Lounge Ha Noi 2 - Ga đi Quốc tế - Sân Bay Nội Bài - Hà Nội',
        'Tầng 3, Khu cách ly, Ga Quốc Tế, Sân bay quốc tế Nội Bài (Gần cửa 21)',
        'Dang hoat dong',
        'b45bd7b0-c853-42b4-8df6-678e74dcdabf',
        'Hà Nội'
    ),
    (
        'b47cd926-b9d9-4747-91b7-18cc12d198e6',
        'SH Premium Lounge Ha Noi 3 - Ga đi Quốc tế - Sân Bay Nội Bài - Hà Nội',
        'Tầng 4, cánh Tây, khu cách ly ga đi Quốc tế, Cảng Hàng không Quốc tế Nội Bài (gần gate 37 & 38)',
        'Dang hoat dong',
        'b45bd7b0-c853-42b4-8df6-678e74dcdabf',
        'Hà Nội'
    ),
    (
        '038d3a15-f663-4a0f-95b6-18d2d8b67f99',
        'Sân bay Quốc tế Phú Quốc',
        'Cảng hàng không quốc tế Phú Quốc Đặc khu Tổ 2, Khu phố, Phú Quốc, An Giang',
        'Dang hoat dong',
        '195ea851-59dd-4e70-ad76-71d0ea76db64',
        'An Giang'
    ),
    (
        'f79636f0-5446-4045-9584-2b995f6fb5ae',
        'Sân bay Quốc tế Tân Sơn Nhất',
        'Nhà ga T2, sân bay Tân Sơn Nhất, 36 Trường Sơn, Tân Sơn Hòa, Hồ Chí Minh',
        'Dang hoat dong',
        '195ea851-59dd-4e70-ad76-71d0ea76db64',
        'Hồ Chí Minh'
    ),
    (
        '80c192ff-1806-4473-b7e9-b6f8baaf678b',
        'LifeLink Hồ Chí Minh',
        'Địa điểm tư vấn mua voucher: Số 122 Nguyễn Hoàng, phường Bình Trưng, TP.Hồ Chí Minh',
        'Dang hoat dong',
        '195ea851-59dd-4e70-ad76-71d0ea76db64',
        'Hồ Chí Minh'
    ),
    (
        'dae599ce-6e24-4c8b-88a8-e7e2cab68256',
        'Phòng chờ The Champ Lounge',
        'Địa điểm sử dụng: Phòng chờ The Champ Lounge - Tầng 2 -  Ga quốc nội cảng HKQT Cam Ranh (gần cửa số 6)',
        'Dang hoat dong',
        '57300452-7745-419b-90f4-9e8d2a07bc3f',
        'Khánh Hòa'
    ),
    (
        'bd1a7fce-0295-45ee-b4ef-d256b8b14573',
        'LifeLink Hà Nội',
        'Địa điểm tư vấn mua voucher: Tầng 12A Tòa văn phòng - TTTM ROX Tower Goldmark City 136 Hồ Tùng Mậu, phường Phú Diễn, Hà Nội',
        'Dang hoat dong',
        '57300452-7745-419b-90f4-9e8d2a07bc3f',
        'Hà Nội'
    ),
    (
        'c8a89575-0f9c-487c-a580-b4851ba1ab0c',
        'Địa điểm tư vấn mua Voucher - LifeLink Hồ Chí Minh',
        'Hồ Chí Minh: Số 122 Nguyễn Hoàng, phường Bình Trưng, TP.Hồ Chí Minh',
        'Dang hoat dong',
        'f7d08df4-04db-4d5a-859f-70ccf5e5e2dd',
        'Hồ Chí Minh'
    ),
    (
        '61c7ad52-a1ff-4446-80fd-3a8b4ac66381',
        'Địa điểm tư vấn mua Voucher - LifeLink Hà Nội',
        'Hà Nội: Tầng 12A Tòa văn phòng - TTTM ROX Tower Goldmark City 136 Hồ Tùng Mậu, Phú Diễn, Hà Nội',
        'Dang hoat dong',
        'f7d08df4-04db-4d5a-859f-70ccf5e5e2dd',
        'Hà Nội'
    ),
    (
        '4c793256-9529-4596-a0ea-52b4eb9c691d',
        'Địa điểm tư vấn mua Voucher - LifeLink Hà Nội',
        'Địa điểm tư vấn mua Voucher: Tầng 12A Tòa văn phòng - TTTM ROX Tower Goldmark City 136 Hồ Tùng Mậu, Phú Diễn, Hà Nội',
        'Dang hoat dong',
        'ab0eb565-e8ad-4b0e-b2f4-cba3521d0411',
        'Hà Nội'
    ),
    (
        '168a25a0-24c7-44a4-a996-6f3f9fc86738',
        'Địa điểm tư vấn mua Voucher - LifeLink Hồ Chí Minh',
        'Địa điểm tư vấn mua Voucher: Số 122 Nguyễn Hoàng, phường Bình Trưng, TP.Hồ Chí Minh',
        'Dang hoat dong',
        'ab0eb565-e8ad-4b0e-b2f4-cba3521d0411',
        'Hồ Chí Minh'
    ),
    (
        '6b908e0b-4e9a-4a32-908d-f55fc24f1258',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - Chi nhánh 1',
        'Số 65 đường Trần Duy Hưng, Phường Yên Hòa, Thành phố Hà Nội, Việt Nam',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        NULL
    ),
    (
        '3550c5e1-45e1-4d90-89ec-34966e2dd7b9',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - Chi nhánh 2',
        'Số 106 phố Huế, Phường Hai Bà Trưng, Thành phố Hà Nội, Việt Nam',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        NULL
    ),
    (
        'd87c0f54-bbff-433f-883c-c647344f7398',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - Chi nhánh 3',
        '65 Trần Duy Hưng, P.Trung Hòa, Q. Cầu Giấy, Hà Nội',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        NULL
    ),
    (
        '77bf47b1-ea7d-45a8-8011-2c15a52616bf',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - Chi nhánh 4',
        '95 Nguyễn Văn Linh, P. Nam Dương, Q. Hải Châu, Tp. Đà Nẵng',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        NULL
    ),
    (
        '01505b30-8de8-4884-ba49-a263b5edbb76',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - Chi nhánh 5',
        '95 Nguyễn Văn Linh, Phường Hải Châu,Thành phố Đà Nẵng,Việt Nam',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        NULL
    ),
    (
        '3a7e5109-9181-4569-a55b-a3fc20e27fe6',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - Chi nhánh 6',
        'Số 02, Khu B1, Lô 7B, Khu ĐTM Ngã 5 SBCB, Phường Gia Viên, Thành phố Hải Phòng, Việt Nam',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        NULL
    ),
    (
        '9dc74bdf-32d2-48d8-a09b-44afb8606397',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - Chi nhánh 7',
        '234B Trần Hưng Đạo, P. An Nghiệp, Q. Ninh Kiều, Tp. Cần Thơ "',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        NULL
    ),
    (
        'dff77033-6f65-43ea-8119-fd47d31e27dc',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - Chi nhánh 8',
        '234B-234C, Trần Hưng Đạo, Phường Ninh Kiều, Thành phố Cần Thơ, Việt Nam',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        NULL
    ),
    (
        '22caa03e-7df4-4a60-a6c2-9db1a2d25a47',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - Chi nhánh 9',
        'Nhà số A1-15, A1-16 Khu Đô Thị Mon Bay, Phường Hạ Long, Tỉnh Quảng Ninh, Việt Nam',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        NULL
    ),
    (
        '96037528-a8e4-44d9-86e3-687b23ceb193',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - Chi nhánh 10',
        'Lô A1, 15-16 Khu Monbay, Đường Trần Quốc Nghiễn, P. Hồng Hải, Tp. Hạ Long, Quảng Ninh',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        NULL
    ),
    (
        'd9421e95-5779-475c-8f4b-c0e7402ea26a',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - Chi nhánh 11',
        'LK06–LK07 Tòa tháp Eurowindow, Số 2, đường Trần Phú, Phường Trường Vinh,tỉnh Nghệ An, Việt Nam',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        NULL
    ),
    (
        '543385d1-3599-4573-9f75-177ee3aed3b3',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - Chi nhánh 12',
        'Vinh: 06-07 tòa nhà Euro Window - Số 2 Trần Phú - phường Hồng Sơn - thành phố Vinh, Nghệ An',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        NULL
    ),
    (
        'c7883925-d148-476e-8599-3c4ed3b1beb8',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - Chi nhánh 13',
        'Số 02 - 04 Ngô Quyền, Phường Buôn Ma Thuột, Tỉnh Đắk Lắk, Việt Nam',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        NULL
    ),
    (
        'd41fc263-11be-4e59-83e6-e37ed4315d50',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - Chi nhánh 14',
        '02 - 04 Ngô Quyền, Phường Thắng Lợi, Tp. Buôn Ma Thuột, Tỉnh Đắk Lắk',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        NULL
    ),
    (
        'bc5de1e2-5077-4c0f-93c6-824ee2e8d0b5',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - Chi nhánh 15',
        '78 Lý Thánh Tôn, Phường Tây Nha Trang, Tỉnh Khánh Hòa, Việt Nam',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        NULL
    ),
    (
        '7c61f905-597a-45d4-9e60-7ae0e1669e51',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - Chi nhánh 16',
        'Số 78 Lý Thánh Tôn, Phường Phương Sài, Tp. Nha Trang',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        NULL
    ),
    (
        'a4dbb326-7e5a-4516-abde-8a7cde3a1c02',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - Chi nhánh 17',
        'Số 154 Đường Trần Hưng Đạo, Phường Phú Thủy, Tỉnh Lâm Đồng, Việt Nam',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        NULL
    ),
    (
        'b4dc9b09-3ad8-4f76-ad21-7553390cda6e',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - Chi nhánh 18',
        '154 Trần Hưng Đạo, P. Phú Thủy, Tp. Phan Thiết',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        NULL
    ),
    (
        'b1f3da2e-5496-446f-906d-ee7e0b81770a',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - Chi nhánh 19',
        'Số 220, đường 30/4, Phường Trấn Biên, Tỉnh Đồng Nai, Việt Nam',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        NULL
    ),
    (
        '421b7b56-9b97-4aeb-af7b-3f2ab91b61e1',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - Chi nhánh 20',
        '157 Nam Kỳ Khởi Nghĩa, Phường 3, Tp. Vũng Tàu.',
        'Dang hoat dong',
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db',
        NULL
    ),
    (
        '9c678f71-bbdb-479c-a1b9-fe0c116dc8ad',
        'Airport Connects - Chi nhánh 1',
        'Tầng 2, Gần cửa khởi hành số 6, Khu cách ly Ga đi Quốc nội, CHK Quốc Tế Phú Bài',
        'Dang hoat dong',
        'b45bd7b0-c853-42b4-8df6-678e74dcdabf',
        NULL
    ),
    (
        'd295daa0-c3e6-4398-9c45-9f53792f5e18',
        'Fast Lane - Consortio - Chi nhánh 1',
        'Cảng hàng không quốc tế Nội Bài Xã Nội Bài - Thành phố Hà Nội',
        'Dang hoat dong',
        '195ea851-59dd-4e70-ad76-71d0ea76db64',
        NULL
    ),
    (
        '139f3108-4a76-4985-b6a8-9a9ec138a789',
        'Fast Lane - Consortio - Chi nhánh 2',
        'Cảng hàng không quốc tế Đà Nẵng  Phường Hòa Cường, Thành phố Đà Nẵng, Việt Nam',
        'Dang hoat dong',
        '195ea851-59dd-4e70-ad76-71d0ea76db64',
        NULL
    ),
    (
        '64afa405-be95-4b21-903c-cb0151b03ba0',
        'Fast Lane - Consortio - Chi nhánh 3',
        'Địa điểm tư vấn mua voucher: Tầng 12A Tòa văn phòng - TTTM ROX Tower Goldmark City 136 Hồ Tùng Mậu, phường Phú Diễn, Hà Nội',
        'Dang hoat dong',
        '195ea851-59dd-4e70-ad76-71d0ea76db64',
        NULL
    ),
    (
        '5250a3e4-7bc7-46f0-bad9-690bc67ba654',
        'Airport Connects - Chi nhánh 2',
        'Tầng 2, Khu cách ly Quốc nội, Cảng HKQT Phú Quốc (gân cửa ra tàu bay số 12)',
        'Dang hoat dong',
        'b45bd7b0-c853-42b4-8df6-678e74dcdabf',
        NULL
    ),
    (
        'ea09404d-2543-476d-a69e-8ae77e16d5b1',
        'Airport Connects - Chi nhánh 3',
        'Tầng 4, Ga T1, Cảng HKQT Đà Nẵng (Đối diện cửa ra tàu bay số 6)',
        'Dang hoat dong',
        'b45bd7b0-c853-42b4-8df6-678e74dcdabf',
        NULL
    ),
    (
        '833dabdd-a07c-40af-bfc0-919f903421ee',
        'Airport Connects - Chi nhánh 4',
        'Tầng 2, Gần cửa khởi hành số 1 và 2, Khu cách ly Ga đi Quốc nội, CHK Quốc Tế Liên Khương.',
        'Dang hoat dong',
        'b45bd7b0-c853-42b4-8df6-678e74dcdabf',
        NULL
    ),
    (
        'aee99873-c94d-45c1-a952-0b038e24d5d6',
        'Airport Connects - Chi nhánh 5',
        'Tầng 1, Khu cách ly Quốc nội, Cảng HK Tuy Hoà (gần cửa ra máy bay ưu tiên)',
        'Dang hoat dong',
        'b45bd7b0-c853-42b4-8df6-678e74dcdabf',
        NULL
    ),
    (
        'a9364e8e-1560-4bf4-b0a4-55185a5b2591',
        'Airport Connects - Chi nhánh 6',
        'Tầng 2, Phòng khách nằm đối diện thang máy, Khu cách ly Ga đi Quốc nội, CHK Phù Cát',
        'Dang hoat dong',
        'b45bd7b0-c853-42b4-8df6-678e74dcdabf',
        NULL
    ),
    (
        'ba8df534-7d17-4696-95b9-c486281560b0',
        'Airport Connects - Chi nhánh 7',
        'Tầng 2, Khu cách ly Quốc nội, Cảng HK Thọ Xuân (Gần cửa ra tàu bay số 2)',
        'Dang hoat dong',
        'b45bd7b0-c853-42b4-8df6-678e74dcdabf',
        NULL
    ),
    (
        'f7d719ee-6eac-4ffe-bfdd-2bd1a758a588',
        'Sân bay Quốc tế Cam Ranh CIAS - Chi nhánh 1',
        'Địa điểm tư vấn mua voucher: Số 122 Nguyễn Hoàng, phường Bình Trưng, TP.Hồ Chí Minh',
        'Dang hoat dong',
        '57300452-7745-419b-90f4-9e8d2a07bc3f',
        NULL
    );
--
-- Data for Name: danh_muc; Type: TABLE DATA; Schema: public; Owner: postgres
--
INSERT INTO "public"."danh_muc" (
        "ma_danh_muc",
        "ten_danh_muc",
        "mo_ta",
        "hinh_anh_url"
    )
VALUES (
        '40000000-0000-0000-0000-000000000001',
        'Ăn uống',
        'Voucher nha hang, quan an va do uong.',
        'https://qsbnxxkqosnoomzgjtyp.supabase.co/storage/v1/object/public/partner-documents/categories/1787643511810_lqsokm.jpg'
    ),
    (
        '40000000-0000-0000-0000-000000000005',
        'Dịch vụ tiện ích',
        'Voucher dich vu tien ich.',
        'https://qsbnxxkqosnoomzgjtyp.supabase.co/storage/v1/object/public/partner-documents/categories/1787643520159_5r8mak.jpg'
    ),
    (
        '40000000-0000-0000-0000-000000000004',
        'Du lịch và Khách sạn',
        'Voucher luu tru va trai nghiem du lich.',
        'https://qsbnxxkqosnoomzgjtyp.supabase.co/storage/v1/object/public/partner-documents/categories/1787643526357_bv4nu.jpg'
    ),
    (
        '40000000-0000-0000-0000-000000000002',
        'Sức khỏe và Làm đẹp',
        'Voucher spa, cham soc da va suc khoe.',
        'https://qsbnxxkqosnoomzgjtyp.supabase.co/storage/v1/object/public/partner-documents/categories/1787643532451_s3sdzc.jpg'
    ),
    (
        '40000000-0000-0000-0000-000000000003',
        'Vui chơi giải trí',
        'Voucher vui choi va su kien.',
        'https://qsbnxxkqosnoomzgjtyp.supabase.co/storage/v1/object/public/partner-documents/categories/1787643539754_5b0rd5.jpg'
    );
--
-- Data for Name: nguoidung; Type: TABLE DATA; Schema: public; Owner: postgres
--
INSERT INTO "public"."nguoidung" (
        "ma_nguoi_dung",
        "ho_ten",
        "email",
        "sdt",
        "ngay_sinh",
        "gioi_tinh",
        "cccd",
        "vai_tro",
        "trang_thai",
        "created_at",
        "ma_chi_nhanh",
        "ma_hsdn"
    )
VALUES (
        '075647fc-d04c-489e-8170-0c96c79a592a',
        'Trần Phương Tuấn',
        'tuan.tran9890@gmail.com',
        '0913541119',
        '1985-06-15',
        'Nu',
        '009651672004',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        '0bb45dbd-d123-48e3-b019-bebbe4939c5d'
    ),
    (
        'b16cec6e-c3a8-433c-b508-9f286bfab4e9',
        'Vũ Minh Thảo',
        'thao.vu2917@gmail.com',
        '0926485142',
        '1985-06-15',
        'Nam',
        '036896330027',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        '0f44c4e9-2b55-4a43-88c8-e51bc848ab1a'
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        'Tran Thu Ha',
        'thuha@ec.local',
        '0900000003',
        '2001-09-12',
        'Nu',
        '079201000003',
        'Khach hang',
        'Dang hoat dong',
        '2026-03-30 09:34:18.18177+00',
        NULL,
        NULL
    ),
    (
        '00000000-0000-0000-0000-000000000004',
        'Le Quoc Bao',
        'quocbao@ec.local',
        '0900000004',
        '2000-06-08',
        'Nam',
        '079200000004',
        'Khach hang',
        'Tam khoa',
        '2026-04-29 09:34:18.18177+00',
        NULL,
        NULL
    ),
    (
        '08de529d-0b28-454f-ad6c-63bb21ec0f72',
        'Hoàng Minh Bình',
        'binh.hoang4440@gmail.com',
        '0919157584',
        '1985-06-15',
        'Nam',
        '011287064508',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        '15ad6191-778f-4a62-95b2-97a5bdaf18f0'
    ),
    (
        'e50eaf1f-9a82-4a5d-b2c3-97e3437d272c',
        'Lê Đức Thảo',
        'thao.le3362@gmail.com',
        '0932700811',
        '1985-06-15',
        'Nam',
        '081041383971',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        '195ea851-59dd-4e70-ad76-71d0ea76db64'
    ),
    (
        'c4374b06-27c6-4539-a641-8faba09d8e7b',
        'Lê Phương Bình',
        'binh.le5420@gmail.com',
        '0949646516',
        '1985-06-15',
        'Nu',
        '097446339990',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        '1c515879-c33a-4175-af65-f74c5034ca13'
    ),
    (
        'f824c05a-ce7d-48f7-af13-67e1436ce9ec',
        'Hoàng Thành An',
        'an.hoang1444@gmail.com',
        '0909557267',
        '1985-06-15',
        'Nam',
        '021838760250',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        '1f6d328f-c0b0-4676-b4f7-29935641dcea'
    ),
    (
        '0b052e89-4234-4302-984f-5df317374e4b',
        'Phạm Minh Thảo',
        'thao.pham8641@gmail.com',
        '0984329800',
        '1985-06-15',
        'Nam',
        '065747616204',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        '2a0f71ae-512d-492c-80c3-53d9180fe5af'
    ),
    (
        '0188041f-b8d9-4c4b-81cc-b1ee671a2cc2',
        'Nguyễn Đức Linh',
        'linh.nguyen3494@gmail.com',
        '0973574387',
        '1985-06-15',
        'Nam',
        '096670913298',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        '32da8e0d-0142-41da-b6b7-172fa52dc131'
    ),
    (
        '9455723b-0ed7-42dd-9353-9de1f6b001c2',
        'Trần Thị Linh',
        'linh.tran9260@gmail.com',
        '0984899842',
        '1985-06-15',
        'Nam',
        '005439184609',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        '4372b404-c218-4eb7-bcb6-c1089a94624b'
    ),
    (
        'd98468cf-202d-4186-9787-d4aab8d5526d',
        'Hoàng Minh An',
        'an.hoang3521@gmail.com',
        '0985955522',
        '1985-06-15',
        'Nam',
        '013250760583',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        '440cc5c3-dbe3-4d65-b735-10b04b2987c3'
    ),
    (
        '9ff07306-5769-4d11-b6a4-b51376bbdcae',
        'Phạm Quang An',
        'an.pham7090@gmail.com',
        '0982678545',
        '1985-06-15',
        'Nu',
        '052581375414',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        '57300452-7745-419b-90f4-9e8d2a07bc3f'
    ),
    (
        'c54a7705-baef-4ac6-b96b-d50338941831',
        'Hoàng Thành Tuấn',
        'tuan.hoang9163@gmail.com',
        '0958752831',
        '1985-06-15',
        'Nam',
        '019989781236',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        '5b61f219-490e-4265-b3d1-1ba7728af1ea'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'Nguyen Ngọc Minh Anh',
        'minhanh@ec.local',
        '0900000000',
        '2002-04-12',
        'Nu',
        '079202000002',
        'Khach hang',
        'Dang hoat dong',
        '2026-01-29 09:34:18.18177+00',
        NULL,
        NULL
    ),
    (
        '513421ae-3f06-47f2-91e8-c6d1981c291e',
        'Hoàng Thị Dũng',
        'dung.hoang9313@gmail.com',
        '0944026529',
        '1985-06-15',
        'Nu',
        '083483147374',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        '5f149f7c-2bc3-4730-bcdd-2eb755ee6513'
    ),
    (
        'a7d8472b-83d7-4dcc-8865-d84691b8b0e1',
        'Vũ Quang Linh',
        'linh.vu7873@gmail.com',
        '0964952489',
        '1985-06-15',
        'Nam',
        '017293468292',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        '7a296d86-e092-4453-b4bd-725b169aee4d'
    ),
    (
        'e5978c25-6c03-4e52-9d0f-b74bc3f735e2',
        'Đặng Thành Hải',
        'hai.dang4447@gmail.com',
        '0989673747',
        '1985-06-15',
        'Nu',
        '014233627081',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        '97cc13f3-9e0f-44d3-93a8-d8725e4fab06'
    ),
    (
        '1436e5f8-d8ba-4942-9597-0b9055d6a16e',
        'Bùi Văn Dũng',
        'dung.bui1678@gmail.com',
        '0975325775',
        '1985-06-15',
        'Nam',
        '049230453604',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        '982c92d0-7f3f-4d5c-9af6-69ff021c5347'
    ),
    (
        '00000000-0000-0000-0000-000000000012',
        'Vo Ngoc Lan',
        'manager.amthuc@ec.local',
        '0900666001',
        '1992-07-19',
        'Nu',
        '079092000012',
        'Nhan vien ban hang',
        'Dang hoat dong',
        '2025-10-11 09:34:18.18177+00',
        '2d5617a6-f948-437e-9bd7-ae70f5d7ff61',
        NULL
    ),
    (
        '203d61be-7294-4239-8eb3-b5b4d2e46bde',
        'Hoàng Phương Thảo',
        'thao.hoang2198@gmail.com',
        '0970993749',
        '1985-06-15',
        'Nu',
        '038569370307',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        'a15af6ae-5802-4568-9e30-cf6e238bd336'
    ),
    (
        '7220708d-8f5e-49e8-adba-d01277869a3b',
        'Lê Thành Hải',
        'hai.le9750@gmail.com',
        '0949466162',
        '1985-06-15',
        'Nu',
        '096439510848',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        'ab0eb565-e8ad-4b0e-b2f4-cba3521d0411'
    ),
    (
        'f1b02fdd-9196-4509-ba71-34ba2e6fc0c4',
        'Nguyễn Minh Tuấn',
        'tuan.nguyen5816@gmail.com',
        '0973219152',
        '1985-06-15',
        'Nam',
        '098899033816',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        'b45bd7b0-c853-42b4-8df6-678e74dcdabf'
    ),
    (
        'a943aaee-a722-4a95-b184-c6a569335157',
        'Vũ Thị An',
        'an.vu9081@gmail.com',
        '0980956243',
        '1985-06-15',
        'Nam',
        '082150329516',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        'c4b32ba0-c514-4b61-8df1-f2afdf45b8db'
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        'Quan tri vien he thong',
        'admin@ec.local',
        '0900000001',
        '1992-08-20',
        'Nam',
        '079092008888',
        'Admin he thong',
        'Dang hoat dong',
        '2025-07-28 09:34:18.18177+00',
        NULL,
        NULL
    ),
    (
        'bf169f4c-48c7-4ce6-ae86-ff6374d34d84',
        'Nguyễn Đức Linh',
        'linh.nguyen9882@gmail.com',
        '0931391505',
        '1985-06-15',
        'Nam',
        '008714656269',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        'c57b538e-359a-4a01-a56c-da54a70db1d1'
    ),
    (
        '639c2d93-a5f4-47d9-a929-6f60f5d1c1b0',
        'Lê Văn Tuấn',
        'tuan.le1838@gmail.com',
        '0992299118',
        '1985-06-15',
        'Nu',
        '028281714357',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        'c6d185d3-3b89-4331-85a6-bd718342e9e1'
    ),
    (
        '00000000-0000-0000-0000-000000000032',
        'Phan Mai Chi',
        'manager.edu@ec.local',
        '0900000032',
        '1991-08-14',
        'Nu',
        '079091000032',
        'Nhan vien quan ly voucher',
        'Dang hoat dong',
        '2026-06-20 09:34:18.18177+00',
        NULL,
        '20000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000042',
        'Do Minh Trang',
        'manager.travel@ec.local',
        '0900000042',
        '1993-12-09',
        'Nu',
        '079093000042',
        'Nhan vien quan ly voucher',
        'Tam khoa',
        '2025-11-25 09:34:18.18177+00',
        NULL,
        '20000000-0000-0000-0000-000000000004'
    ),
    (
        '32702bb9-17c7-4fc9-9707-89e4a9d678ef',
        'Lê Thành Bình',
        'binh.le1722@gmail.com',
        '0977927125',
        '1985-06-15',
        'Nu',
        '086068761187',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        'd69ba734-c3f9-4813-be9f-d1d83d7ec45c'
    ),
    (
        '3a08991e-7528-4f25-aaff-eee2ed6805fb',
        'Đặng Thành Hải',
        'hai.dang4500@gmail.com',
        '0955230882',
        '1985-06-15',
        'Nam',
        '082602806854',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        'da49801a-ad11-4e33-9dc1-9919589faf11'
    ),
    (
        '00000000-0000-0000-0000-000000000043',
        'Ngo Hoai Phuong',
        'staff.travel12@ec.local',
        '0900000043',
        '1997-03-26',
        'Nu',
        '079097000043',
        'Nhan vien ban hang',
        'Tam khoa',
        '2025-12-20 09:34:18.18177+00',
        '30000000-0000-0000-0000-000000000002',
        NULL
    ),
    (
        '083ed0d7-6e91-4f7b-aaf6-6416d35c751c',
        'Bùi Văn Dũng',
        'dung.bui8924@gmail.com',
        '0982296971',
        '1985-06-15',
        'Nu',
        '068787124507',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        'e8acc2e0-6d3e-4b9f-8e28-78e11edc73e7'
    ),
    (
        'fea62739-6ed0-40e4-96ae-868d4572e107',
        'Vũ Văn Bình',
        'binh.vu8508@gmail.com',
        '0928170361',
        '1985-06-15',
        'Nu',
        '022720690833',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        'e9359a63-2fa3-43b8-86e2-d3999ca004d2'
    ),
    (
        '5367824f-e76f-421f-b9a6-c8b11ac21b04',
        'Trần Văn Linh',
        'linh.tran6571@gmail.com',
        '0979505345',
        '1985-06-15',
        'Nam',
        '049935296627',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        'e9785604-dd4f-4067-8d07-3396c5af9c34'
    ),
    (
        '83548d01-4f86-4f7c-bcb2-dd74b4f3b8e0',
        'Vũ Thành Thảo',
        'thao.vu4229@gmail.com',
        '0950090772',
        '1985-06-15',
        'Nu',
        '022324457064',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-08-24 20:04:58+00',
        NULL,
        'f7d08df4-04db-4d5a-859f-70ccf5e5e2dd'
    ),
    (
        '00000000-0000-0000-0000-000000000021',
        'Nguyen Thi An',
        'owner.spa@ec.local',
        '0900000021',
        '1987-10-05',
        'Nu',
        '079087000021',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-07-08 09:34:18.18177+00',
        NULL,
        '20000000-0000-0000-0000-000000000002'
    ),
    (
        '00000000-0000-0000-0000-000000000031',
        'Truong Van Hung',
        'owner.edu@ec.local',
        '0900000031',
        '1985-05-22',
        'Nam',
        '079085000031',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2026-06-18 09:34:18.18177+00',
        NULL,
        '20000000-0000-0000-0000-000000000003'
    ),
    (
        '00000000-0000-0000-0000-000000000013',
        'Lam Tuan Kiet',
        'staff.nguyenhue@ec.local',
        '0900000013',
        '1998-01-07',
        'Nam',
        '079098000013',
        'Nhan vien ban hang',
        'Dang hoat dong',
        '2025-11-20 09:34:18.18177+00',
        '30000000-0000-0000-0000-000000000004',
        NULL
    ),
    (
        '7ea47cd9-a0f5-4eb8-81a6-d7fb7df7be76',
        'Nguyễn Ngọc Linh',
        'nnl1@gmail.com',
        '3093939939',
        '2004-07-29',
        'Nu',
        '202389120390',
        'Nhan vien quan ly voucher',
        'Dang hoat dong',
        '2026-08-25 09:21:29.323461+00',
        NULL,
        '5f149f7c-2bc3-4730-bcdd-2eb755ee6513'
    ),
    (
        '00000000-0000-0000-0000-000000000041',
        'Bui Duc Long',
        'owner.travel@ec.local',
        '0900000041',
        '1986-11-30',
        'Nam',
        '079086000041',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2025-11-20 09:34:18.18177+00',
        NULL,
        '20000000-0000-0000-0000-000000000004'
    ),
    (
        '00000000-0000-0000-0000-000000000101',
        'Quan tri vien he thong',
        'admin_ht@ec.com',
        '0900000100',
        '1995-01-15',
        'Khac',
        '079095000100',
        'Admin he thong',
        'Dang hoat dong',
        '2026-08-19 13:29:47.092624+00',
        NULL,
        NULL
    ),
    (
        '00000000-0000-0000-0000-000000000102',
        'Quan tri vien kiem duyet',
        'admin_kd@ec.com',
        '0900000101',
        '1994-03-20',
        'Nu',
        '079094000101',
        'Admin kiem duyet',
        'Dang hoat dong',
        '2026-08-19 13:29:47.092624+00',
        NULL,
        NULL
    ),
    (
        '00000000-0000-0000-0000-000000000103',
        'Quan tri vien van hanh',
        'admin_vh@ec.com',
        '0900000102',
        '1993-07-12',
        'Nam',
        '079093000102',
        'Admin van hang',
        'Dang hoat dong',
        '2026-08-19 13:29:47.092624+00',
        NULL,
        NULL
    ),
    (
        '00000000-0000-0000-0000-000000000011',
        'Nguyễn Ngọc Hương Linh',
        'nnhh.amthuc@ec.local',
        '0905600001',
        '1988-08-15',
        'Nu',
        '079023333334',
        'Nguoi dai dien',
        'Dang hoat dong',
        '2025-10-01 09:34:18.18177+00',
        NULL,
        '20000000-0000-0000-0000-000000000001'
    );
--
-- Data for Name: taikhoan; Type: TABLE DATA; Schema: public; Owner: postgres
--
INSERT INTO "public"."taikhoan" (
        "ma_tk",
        "thong_tin_dang_nhap",
        "mat_khau",
        "ma_nguoi_dung"
    )
VALUES (
        '2f709c3f-b2d5-4359-9d12-efbb683e1462',
        'linh.nguyen3494@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '0188041f-b8d9-4c4b-81cc-b1ee671a2cc2'
    ),
    (
        '9f536363-0715-4661-ae56-c2ca5db5d0e4',
        'tuan.tran9890@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '075647fc-d04c-489e-8170-0c96c79a592a'
    ),
    (
        'a70820ef-3ab5-43a7-8f42-8962a44d5fad',
        'dung.bui8924@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '083ed0d7-6e91-4f7b-aaf6-6416d35c751c'
    ),
    (
        '0c21d04e-34d5-4aab-abfa-0565802a52ee',
        'binh.hoang4440@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '08de529d-0b28-454f-ad6c-63bb21ec0f72'
    ),
    (
        '10000000-0000-0000-0000-000000000003',
        'thuha@ec.local',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '00000000-0000-0000-0000-000000000003'
    ),
    (
        '10000000-0000-0000-0000-000000000004',
        'quocbao@ec.local',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '00000000-0000-0000-0000-000000000004'
    ),
    (
        '42d3b2a3-757a-4490-ac13-e3471aa61320',
        'thao.pham8641@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '0b052e89-4234-4302-984f-5df317374e4b'
    ),
    (
        '6d89ecf5-9022-4dd0-85b0-8f3d75cfd7d6',
        'dung.bui1678@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '1436e5f8-d8ba-4942-9597-0b9055d6a16e'
    ),
    (
        '10000000-0000-0000-0000-000000000013',
        'staff.nguyenhue@ec.local',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '00000000-0000-0000-0000-000000000013'
    ),
    (
        '10000000-0000-0000-0000-000000000021',
        'owner.spa@ec.local',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '00000000-0000-0000-0000-000000000021'
    ),
    (
        '641b504f-b634-4fa2-99b2-e44632b03580',
        'thao.hoang2198@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '203d61be-7294-4239-8eb3-b5b4d2e46bde'
    ),
    (
        '10000000-0000-0000-0000-000000000031',
        'owner.edu@ec.local',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '00000000-0000-0000-0000-000000000031'
    ),
    (
        '10000000-0000-0000-0000-000000000032',
        'manager.edu@ec.local',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '00000000-0000-0000-0000-000000000032'
    ),
    (
        '10000000-0000-0000-0000-000000000041',
        'owner.travel@ec.local',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '00000000-0000-0000-0000-000000000041'
    ),
    (
        '10000000-0000-0000-0000-000000000042',
        'manager.travel@ec.local',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '00000000-0000-0000-0000-000000000042'
    ),
    (
        'ba2dbf97-abd7-4c3a-a790-1a89912180ad',
        'binh.le1722@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '32702bb9-17c7-4fc9-9707-89e4a9d678ef'
    ),
    (
        '10000000-0000-0000-0000-000000000001',
        'admin@ec.local',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '00000000-0000-0000-0000-000000000001'
    ),
    (
        '72f22b76-3cdd-4e4d-86f4-8856444a50d7',
        'hai.dang4500@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '3a08991e-7528-4f25-aaff-eee2ed6805fb'
    ),
    (
        '7ea9c914-f58e-46ad-ae35-0ed7941f7904',
        'dung.hoang9313@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '513421ae-3f06-47f2-91e8-c6d1981c291e'
    ),
    (
        '2bccffa4-4d9a-4b6b-bd56-1c29da434c89',
        'linh.tran6571@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '5367824f-e76f-421f-b9a6-c8b11ac21b04'
    ),
    (
        '37d53088-eb8b-45bf-93ff-d38bdd23bb04',
        'tuan.le1838@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '639c2d93-a5f4-47d9-a929-6f60f5d1c1b0'
    ),
    (
        'a644ea5c-bc8b-4348-9d5a-e3ac6d7a59ee',
        'hai.le9750@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '7220708d-8f5e-49e8-adba-d01277869a3b'
    ),
    (
        '76f178f8-1333-4239-abeb-9705f34689e2',
        'thao.vu4229@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '83548d01-4f86-4f7c-bcb2-dd74b4f3b8e0'
    ),
    (
        'ccd50b4a-e529-4e63-b4e3-851afe249985',
        'linh.tran9260@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '9455723b-0ed7-42dd-9353-9de1f6b001c2'
    ),
    (
        '82cb0532-a89c-4cf4-b05b-2333c62cc092',
        'an.pham7090@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '9ff07306-5769-4d11-b6a4-b51376bbdcae'
    ),
    (
        'e355cd98-50e6-48d3-8027-c2d9970f95bf',
        'linh.vu7873@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        'a7d8472b-83d7-4dcc-8865-d84691b8b0e1'
    ),
    (
        '480b63fb-68df-457e-a382-78fce1764698',
        'an.vu9081@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        'a943aaee-a722-4a95-b184-c6a569335157'
    ),
    (
        'ec49eed7-4003-4c74-b73b-5fab302a48ba',
        'thao.vu2917@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        'b16cec6e-c3a8-433c-b508-9f286bfab4e9'
    ),
    (
        '0673fa19-f1e6-4768-bb77-daa94f5152b0',
        'linh.nguyen9882@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        'bf169f4c-48c7-4ce6-ae86-ff6374d34d84'
    ),
    (
        '26a7be59-c18f-4a78-ab36-03820e9b19c0',
        'binh.le5420@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        'c4374b06-27c6-4539-a641-8faba09d8e7b'
    ),
    (
        '03ab97ca-9b9e-42c9-9cd7-a96494e0b749',
        'tuan.hoang9163@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        'c54a7705-baef-4ac6-b96b-d50338941831'
    ),
    (
        'a11de0e1-a930-4e0d-857d-01835d151b3d',
        'an.hoang3521@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        'd98468cf-202d-4186-9787-d4aab8d5526d'
    ),
    (
        '38ac1a0d-79c8-4782-9e5c-170669b0a336',
        'thao.le3362@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        'e50eaf1f-9a82-4a5d-b2c3-97e3437d272c'
    ),
    (
        'ca2ab0a8-9b37-4655-8718-bcb0c6033efb',
        'hai.dang4447@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        'e5978c25-6c03-4e52-9d0f-b74bc3f735e2'
    ),
    (
        '45f287e1-51d7-4808-98bc-6de516e5b961',
        'tuan.nguyen5816@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        'f1b02fdd-9196-4509-ba71-34ba2e6fc0c4'
    ),
    (
        '10000000-0000-0000-0000-000000000043',
        'staff.travel12@ec.local',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '00000000-0000-0000-0000-000000000043'
    ),
    (
        'c7eaedd9-a543-46aa-bbe0-69b8100e9f1c',
        'an.hoang1444@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        'f824c05a-ce7d-48f7-af13-67e1436ce9ec'
    ),
    (
        'f798f5c0-fedb-4eb8-8404-a6b3bfa69b4c',
        'binh.vu8508@gmail.com',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        'fea62739-6ed0-40e4-96ae-868d4572e107'
    ),
    (
        '10000000-0000-0000-0000-000000000011',
        'owner.amthuc@ec.local',
        '$2b$10$2dSL5EaIQ4n9f5u/ipb9Se7rMsqixNfX22ho65wEazjfaZKs5fg2O',
        '00000000-0000-0000-0000-000000000011'
    ),
    (
        '10000000-0000-0000-0000-000000000002',
        'minhanh@ec.local',
        '$2b$10$uV.6Lm5JJs01tLelPEBGz.hn7WXWr8bP62MPDSM65O7kN2MK6EW0i',
        '00000000-0000-0000-0000-000000000002'
    ),
    (
        '10000000-0000-0000-0000-000000000012',
        'manager.amthuc@ec.local',
        '$2b$10$EoJ9ZswFE82nq5SNzhPwn.GEUl7zmuAFyDP9gVsanlxkrMZAHrZiy',
        '00000000-0000-0000-0000-000000000012'
    ),
    (
        '87700ee1-5a78-4728-881a-95b2a12027c4',
        'nnl1@gmail.com',
        '$2b$08$9gfiyC7KFKM1iIHY9TaZg.zJ3Y32PW1UM8RqFKxrbMa2n0czhyqpy',
        '7ea47cd9-a0f5-4eb8-81a6-d7fb7df7be76'
    ),
    (
        '10000000-0000-0000-0000-000000000101',
        'admin_ht@ec.com',
        '$2a$06$xXnAcS2HNC8a6pJbFA2nr.r6kZipWQ/k8ga69eC6aUPQkb.HPxW4y',
        '00000000-0000-0000-0000-000000000101'
    ),
    (
        '10000000-0000-0000-0000-000000000102',
        'admin_kd@ec.com',
        '$2a$06$ybyWFHPlzH4Dhbo7uF2mBuSb1FesiwTT8bzUOQiNceFAhj8HzZhOy',
        '00000000-0000-0000-0000-000000000102'
    ),
    (
        '10000000-0000-0000-0000-000000000103',
        'admin_vh@ec.com',
        '$2a$06$meiJsmGQBdO2q3jTCy8B9uNZOGrfum0KhjV2lV7N4c41s0aIAZa.C',
        '00000000-0000-0000-0000-000000000103'
    );
--
-- Data for Name: donhang; Type: TABLE DATA; Schema: public; Owner: postgres
--
INSERT INTO "public"."donhang" (
        "ma_dh",
        "ngay_dat",
        "tong_tien",
        "trang_thai",
        "ly_do_huy",
        "nguoi_nhan",
        "ma_tk_dat"
    )
VALUES (
        '3ec3d071-355e-4a88-af3d-ff8f18b41fe6',
        '2026-08-25 08:39:08.276027+00',
        427500.00,
        'Da thanh toan',
        NULL,
        NULL,
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '7d837d27-a36b-4769-8b03-d4708625f781',
        '2026-08-25 08:50:05.957492+00',
        1450000.00,
        'Da thanh toan',
        NULL,
        NULL,
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        'eb5f634d-0d4d-4086-8ee3-a631a28c9efa',
        '2026-08-25 08:57:15.328095+00',
        1364000.00,
        'Da thanh toan',
        NULL,
        NULL,
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        'b0e9fcfb-6a33-4a30-99ca-f733dfbd84dc',
        '2026-08-25 08:58:41.971856+00',
        1584000.00,
        'Da thanh toan',
        NULL,
        NULL,
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        'e79579ea-108c-43d4-911a-8ac0eb75cbfb',
        '2026-08-25 09:01:48.093002+00',
        1164000.00,
        'Da thanh toan',
        NULL,
        NULL,
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '23630202-3c0c-44e5-81e6-34e3a69c503b',
        '2026-08-25 09:02:19.543656+00',
        450000.00,
        'Da thanh toan',
        NULL,
        NULL,
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '3ba2f92e-09bd-465c-9705-e195a0cad9f7',
        '2026-08-25 09:03:38.157718+00',
        450000.00,
        'Da thanh toan',
        NULL,
        NULL,
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '53891e60-c3f6-46f4-b9e5-5c3809eb464a',
        '2026-08-25 09:07:48.12421+00',
        450000.00,
        'Da thanh toan',
        NULL,
        NULL,
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        'd59be9a7-fdee-4327-b440-440fb70d9191',
        '2026-08-25 09:09:39.399814+00',
        714000.00,
        'Da thanh toan',
        NULL,
        NULL,
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '21244aea-2a16-4236-8cc4-cde57a591e73',
        '2026-08-25 09:12:58.148282+00',
        450000.00,
        'Da thanh toan',
        NULL,
        NULL,
        '10000000-0000-0000-0000-000000000002'
    );
--
-- Data for Name: voucher; Type: TABLE DATA; Schema: public; Owner: postgres
--
INSERT INTO "public"."voucher" (
        "ma_voucher",
        "ten_voucher",
        "mo_ta",
        "gia_goc",
        "gia_tri_giam",
        "dieu_kien_ap_dung",
        "so_luong_phat_hanh",
        "tg_bat_dau_ban",
        "tg_ket_thuc_ban",
        "trang_thai",
        "chinh_sach_hoan_huy",
        "hinh_anh_url",
        "so_luong_da_ban",
        "ma_danh_muc"
    )
VALUES (
        'e26ec4a8-2eb2-4d34-a3cf-e03dad20c141',
        'SH Premium Lounge Con Dao tại Sân bay Côn Đảo - Vé trẻ em',
        'Voucher áp dụng cho "SH Premium Lounge Con Dao tại Sân bay Côn Đảo - Vé trẻ em" mang đến cho quý khách hàng những dịch vụ chất lượng nhất.
Phòng chờ thương gia
SH Premium Lounge Con Dao
sở hữu phong cách kiến trúc hiện đại, có bố cục và nội thất được thiết kế tỉ mỉ, mang dấu ấn riêng biệt, cùng dịch vụ định hướng 5 sao.
Phòng chờ được chia thành nhiều khu vực chức năng như: chỗ nghỉ ngơi, quầy bar/ buffet, phòng hút thuốc... luôn đáp ứng một các tốt nhất nhu cầu đa dạng của hành khách.
Đặc biệt, menu đa dạng, chế biến khéo léo và bày trí đẹp mắt từ các món ăn đặc sản truyền thống của Côn Đảo như: bún, phở,... đến những món khai vị/ đồ uống/ đồ tráng miệng đặc sắc.
Với đội ngũ nhân viên chuyên nghiệp, chu đáo, nhiệt tình cùng phong cách phục vụ cởi mở, chân thành, hiếu khách, Phòng chờ
SH Premium Lounge Con Dao
hứa hẹn làm hài lòng mọi quý khách hàng.',
        225000.00,
        213750.00,
        'Voucher bao gồm:
Mã ưu đãi 1 lượt sử dụng dịch vụ phòng chờ SH Premium Lounge Con Dao tại Sân bay Côn Đảo - Vé trẻ em
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu
Địa điểm áp dụng: Tầng 1, cạnh cửa khởi hành số 1, Khu cách ly Ga đi Quốc nội, CHK Côn Đảo
Vị trí: Ga đi Quốc nội - Sân Bay Côn Đảo - Bà Rịa Vũng Tàu
Khách hàng được sử dụng mọi dịch vụ tại phòng chờ theo quy định của phòng chờ.
Mã ưu đãi chỉ có giá trị sử dụng một lần. Không chấp nhận Voucher ưu đãi quá hạn sử dụng hoặc trạng thái “Đã sử dụng”.
Vui lòng xuất trình mã ưu đãi cho nhân viên tại quầy để được áp dụng ưu đãi.
Khách hàng có thể được yêu cầu trả thêm tiền nếu sử dụng quá giá trị của Mã ưu đãi.
Lưu ý:
Khách hàng sẽ thanh toán trực tiếp tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại mỗi phòng chờ khi:
Khách hàng sử dụng quá thời gian quy định của phòng chờ.
Khách hàng có phát sinh các dịch vụ khác thêm tại phòng chờ
Khách hàng có trẻ em đi kèm mà chưa đăng ký dịch vụ trước qua LifeLink 1900 2065. Thời gian thông báo tối thiểu với LifeLink trước 1 ngày sử dụng dịch vụ LifeLink hoàn toàn không chịu trách nhiệm khi có các phát sinh thêm bên trên."
Khách hàng áp dụng: Khách từ 5 đến 12 tuổi
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng: 05:30 - 17:00
Số lượng E-Voucher áp dụng:
01 voucher/khách/1 lượt sử dụng
Áp dụng nhiều voucher trên 1 hóa đơn
Dịch vụ bao gồm: Các dịch vụ theo tiêu chuẩn tại phòng chờ
Dịch vụ không bao gồm: Chi phí cá nhân và các chi phí phát sinh khác
Chính sách phụ thu trẻ em:
Miễn phí tối đa cho 02 trẻ em dưới 5 tuổi đi kèm cùng mỗi người lớn sử dụng dịch vụ Phòng khách.
Trẻ em dưới 5 tuổi thứ ba trở đi và Trẻ em từ 5 tuổi đến 12 tuổi mức phí bằng 50% đơn giá niêm yết/trẻ em.
Hành khách trên 12 tuổi được tính như quy định đối với người lớn.
Các trường hợp người đi kèm, nếu không được thông báo trước, dịch vụ gia tăng sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách."
Chính sách phụ thu sử dụng thêm giờ:
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu.
Cứ mỗi 03 (ba) tiếng thêm giờ phát sinh được xác định là 01 (một) khung thêm giờ (Block). Thời gian thêm giờ phát sinh dưới 3 (ba) tiếng được tính tròn là 01 (một) Block.
Đơn giá thêm giờ là: 50% phí dịch vụ /khách/ block (thêm giờ).
Hành khách tự thanh toán chi phí thêm giờ trực tiếp tại quầy lễ tân theo giá công bố tại phòng khách.
Quy trình sử dụng dịch vụ:
Bước 1: Khách hàng Xuất trình xuất trình mã ưu đãi/ mã QR trên ứng dụng LifeLink/ hoặc email/ hoặc Zalo cùng Thẻ lên tàu bay tại quầy lễ tân Phòng khách.
Bước 2: Nhân viên Phòng khách xác thực mã QR trên hệ thống.
Trường hợp 1: Xác thực không thành công: Nhân viên Lễ tân Phòng khách từ chối phục vụ khách đồng thời Nhờ khách hàng liên hệ lại Hotline LifeLink 1900 2065 để được hỗ trợ nhanh chóng.
Trường hợp 2: Xác thực thành công: Nhân viên Lễ tân Phòng khách hoàn tất trên hệ thống.
Bước 3: Nhân viên Lễ tân Phòng khách mời Hành khách sử dụng Dịch vụ Phòng chờ Thương gia.
Điều kiện lưu ý bắt buộc:
Các trường hợp phát sinh không thông báo trước như: Có vé trẻ em đi kèm,... sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách, LifeLink hoàn toàn không chịu trách nhiệm.
Thời gian thông báo tối thiểu trước 1 ngày sử dụng dịch vụ
Hotline hỗ trợ tư vấn (9h-20h): 1900 2065
Điều kiện khác:
Áp dụng 01 E-Voucher/E-Coupon cho 01 khách
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Mã ưu đãi được xuất ra sẽ không được đổi trả dưới mọi hình thức.
Giá trên đã bao gồm phí phục vụ và thuế GTGT',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/1_13052026163216.jpg?sign=b9IQrGVQH0SQfpoXp-HHdw',
        2,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        '145c7bd7-740d-4ced-9971-b73b22f341e1',
        'Vé vào cổng KidZania Lotte Mall Tây Hồ dành cho Trẻ em cả ngày - Áp dụng Thứ 2 - Thứ 6',
        'Vé KidZania Lotte Mall Tây Hồ mang đến cơ hội để trẻ hóa thân thành nhiều ngành nghề yêu thích trong môi trường mô phỏng chân thực.
Không gian rộng hơn 5.300m² với hàng chục khu trải nghiệm hiện đại và an toàn.
Bé được học hỏi kỹ năng sống, tư duy tài chính và tinh thần làm việc nhóm thông qua các hoạt động nhập vai.
Phù hợp cho trẻ từ 4 đến 15 tuổi với đa dạng chủ đề nghề nghiệp hấp dẫn.
Đặt vé nhanh chóng tại LifeLink với quy trình đơn giản, hỗ trợ tận tình.
Lựa chọn lý tưởng cho các gia đình muốn kết hợp vui chơi và giáo dục cuối tuần.',
        450000.00,
        450000.00,
        'Tổng thời gian gói dịch vụ: 1 lần
Thời gian một lần dịch vụ: Cả ngày.
Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 09:00 - 20:00
Khách hàng áp dụng: Trẻ em từ 4 - 15 tuổi.
Số lượng E-Voucher áp dụng:
Một khách hàng được mua nhiều phiếu.
Sử dụng 01 vé/ 01 khách hàng/ 1 lần
Không giới hạn số E-voucher trên 1 hoá đơn
Lưu ý: Vui lòng không mang đồ ăn uống (trừ sữa công thức và thuốc kê đơn) từ bên ngoài vào để đảm bảo môi truong vui chơi an toàn và thoải mái cho trẻ.
Thông tin liên hệ đặt dịch vụ:
Địa chỉ: Khu trải nghiệm KidZania Hà Nội (Tầng 5, Trung tâm thương mại Lotte Mall Hà Nội, số 272 đường Võ Chí Công, phường Tây Hồ, thành phố Hà Nội
Hotline Kidzania: 1900 0114
Hotline Lifelink: 1900 2065
Điều kiện khác
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Giá đã bao gồm VAT
Vé đã mua không hoàn hủy, đặt trước tối thiểu 1 ngày',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-KidZania-Ha-Noi-2_21072026171922.jpg?sign=SS-XdJkfzWpgccljfGP79w',
        7,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        'c20a13d7-c47e-42e9-a0a3-ba515075b1bf',
        'E-voucher - Hộp bánh trung thu Trăng Tinh Hoa',
        'Thương hiệu BioFun, mang đến lựa chọn quà Trung Thu trang trọng và ý nghĩa.
Bánh nướng sen Đông Trùng Hạ Thảo tạo điểm nhấn độc đáo cho hộp quà.
Bánh nướng thập cẩm đặc biệt trứng mang hương vị truyền thống đậm đà.
Kèm hộp nước uống Đông Trùng Hạ Thảo BIOK tiện lợi.
Bao bì hộp và khay định hình được thiết kế đồng bộ, chỉn chu.
Sự kết hợp đa dạng giúp hộp quà phù hợp với nhiều đối tượng nhận.
Là lựa chọn lý tưởng cho quà biếu gia đình, khách hàng, đối tác và nhân viên.',
        793800.00,
        714000.00,
        'Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 9h00 -17h00
Thông tin liên hệ đặt dịch vụ
Hotline lifelink (9h00-20h00): 1900 2065
Hotline BioFun: 0355983628
Địa chỉ lấy bánh Số 10 ngõ 102 Trần Phú,Mỗ Lao, Hà Đông, Hà Nội
Điều kiện áp dụng:
Áp dụng 01 E-Voucher cho 01 hộp
Một khách hàng được mua nhiều E-Voucher
E-Voucher không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Giá đã bao gồm VAT, chưa bao gồm phí ship',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Trang-Tinh-Hoa_21082026110447.jpg?sign=Xx2_sP8ngdoz34hETooSYg',
        3,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        '4e1cc348-8c38-4f4b-802f-b35e684bc5c8',
        'DuYen Cruise - Halong Bay Excursion 2 Days 1 Night',
        'Du Junior Cabin, 30m², private balcony, accommodates 2 adults + 1 child under 5 years old.

Equipped with a double bed or two single beds, with an extra bed available, located on the quiet first floor.
All meals on board are included: breakfast, lunch, dinner, and brunch on the last day.
Enjoy an English-speaking guide, entrance tickets, insurance, and VAT included.
Experience kayaking, visiting Sung Sot Cave, Ti Top Island, and Luon Cave.
Relax with a tea party and "Art of Tea" workshop, and experience traditional brocade costumes.
Luxury amenities: Wi-Fi, welcome drink, private transfer.
Exclusive 2-day/1-night combo, ideal for couples or small families seeking a luxurious getaway.',
        7900000.00,
        7528000.00,
        'Services included:
Room type:
Du Junior Cabin.
Other amenities:
English-speaking tour guide.
Entrance fees and tickets.
One night''s stay on board in an air-conditioned cabin.
All meals on board: breakfast, lunch, and dinner.
Kayaking to explore the bay.
Special welcome drink upon boarding.
Free Wi-Fi in the lobby and on the shuttle bus (if used).
Travel insurance and VAT included.
Check-in/Check-out times:
Early check-in - Late check-out: Subject to room availability and may incur additional charges as per provider''s regulations.
Note:
Price excludes drinks, tips, and personal expenses.
Excludes transportation between Hanoi and Ha Long.

Entrance fees may change from 2026 according to regulations of the Ha Long Bay Management Board.

Not applicable during holidays and Tet (Lunar New Year).

Customers need to contact us to register for services before arriving to ensure the best service.

Surcharges:
Bus surcharge: 200,000 VND/one-way/person if transportation service is booked.
Limousine surcharge: 350,000 VND/one-way/person if transportation service is booked.
Mandatory gala dinner surcharge on special occasions: 700,000 VND/adult and 500,000 VND/child (Christmas Eve 24/12, New Year''s Eve 31/12, and Lunar New Year holidays 30, 1, 2, 3 of the first lunar month).

Contact Information:
Address: G55 Waiting Area, Port No. 2, Tuan Chau International Cruise Port - Quang Ninh.

Hotline: 1900 2065 or 0934 661 016.
Other conditions:
One e-Voucher is valid for 2 adults/room.
E-Vouchers cannot be exchanged for cash and no change will be given.
Not applicable in conjunction with other promotions.
No refunds or cancellations after confirmation.',
        189,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Tam ngung',
        'Not redeemable for cash. Refunds are available if cancelled 24 hours in advance.',
        '//cdn.lifelink.vn/img/c280x280/Du-Yen-Cruise-2_19052026150059.jpg?sign=NiqASMeCSV6LV-H-ioO5Rw',
        0,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        'ce8f44d7-2193-4758-a045-eb6d96a9ef04',
        'Vé vào cổng KidZania Lotte Mall Tây Hồ dành cho Trẻ em cả ngày - Áp dụng Thứ 7, Chủ nhật, Lễ Tết',
        'Vé KidZania Lotte Mall Tây Hồ dành cho trẻ em trải nghiệm vui chơi cả ngày vào Thứ 7 và Chủ nhật.
Bé được tham gia hơn 48 hoạt động nghề nghiệp trong không gian giáo trí hiện đại rộng 5.300m².
Mô hình học tập kết hợp vui chơi giúp phát triển kỹ năng sống, tư duy sáng tạo và làm việc nhóm.
Phù hợp cho trẻ từ 4 đến 15 tuổi với nhiều hoạt động nhập vai hấp dẫn.
Đặt vé nhanh chóng tại LifeLink với quy trình tiện lợi và hỗ trợ tận tình.
Lựa chọn hoàn hảo để cả gia đình tận hưởng cuối tuần ý nghĩa cùng các bé.',
        510000.00,
        510000.00,
        'Tổng thời gian gói dịch vụ: 1 lần
Thời gian 1 lần dịch vụ: Cả ngày.
Ngày áp dụng: Thứ 7 - Chủ nhật, Lễ Tết.
Giờ áp dụng: 09:00 - 20:00
Khách hàng áp dụng: Trẻ em từ 4 - 15 tuổi.
Số lượng E-Voucher áp dụng:
Một khách hàng được mua nhiều phiếu.
Sử dụng 01 vé/ 01 khách hàng/ 1 lần
Không giới hạn số E-voucher trên 1 hoá đơn
Lưu ý: Vui lòng không mang đồ ăn uống (trừ sữa công thức và thuốc kê đơn) từ bên ngoài vào để đảm bảo môi truong vui chơi an toàn và thoải mái cho trẻ.
Thông tin liên hệ đặt dịch vụ:
Địa chỉ: Khu trải nghiệm KidZania Hà Nội (Tầng 5, Trung tâm thương mại Lotte Mall Hà Nội, số 272 đường Võ Chí Công, phường Tây Hồ, thành phố Hà Nội
Hotline Kidzania: 1900 0114
Hotline Lifelink: 1900 2065
Điều kiện khác
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Giá đã bao gồm VAT
Vé đã mua không hoàn hủy, đặt trước tối thiểu 1 ngày',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-KidZania-Ha-Noi-1_21072026171236.jpg?sign=qlPW7PZXmEiPOq7-QPcVkA',
        0,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        '14ee3519-8d8a-4920-b69e-e80654f6f16e',
        'Vé Tàu Hà Nội 5 Cửa Ô Tầng 2 - Toa Ô Cầu Dền, Ô Quan Chưởng, Ô Cầu Giấy, Ô Đống Mác - The Hanoi Train',
        'Vé Tàu Hà Nội 5 Cửa Ô Tầng 2 mang đến góc nhìn cao, rộng và thoáng để chiêm ngưỡng cảnh sắc dọc hành trình.
Các toa Ô Cầu Dền, Ô Quan Chưởng, Ô Cầu Giấy và Ô Đống Mác được thiết kế theo chủ đề riêng, tái hiện vẻ đẹp Thăng Long xưa.
Không gian nội thất hiện đại, sang trọng kết hợp hài hòa giữa văn hóa, nghệ thuật và tiện nghi.
Hệ thống cửa kính lớn giúp du khách dễ dàng ngắm nhìn thiên nhiên và nhịp sống Hà Nội.
Phù hợp cho khách du lịch, gia đình, nhóm bạn và những người yêu thích trải nghiệm mới mẻ.
Đặt vé nhanh chóng, thuận tiện và an tâm cùng LifeLink.',
        650000.00,
        650000.00,
        'Khách hàng áp dụng: Tất cả khách hàng từ 8 tuổi trở lên.
Ngày áp dụng
Tháng 7:
8h00: Ngày 17, 18, 19, 29, 31
13h30: Ngày 18, 19, 28
Tháng 08
8h00: Ngày 01, 02, 05, 07, 08, 09, 12, 14, 15, 16, 19, 21, 22, 23, 26, 28, 29, 30
13h30: Ngày 1, 2, 4, 6, 8, 9, 11, 13, 15, 16, 18, 20, 22, 23, 25, 27, 29, 30
Tháng 09
8h00: Ngày 01, 02, 04, 05, 06, 09, 11, 12, 13, 16, 18, 19, 20, 23, 25, 26, 27, 30
13h30: Ngày 01, 02, 05, 06, 08, 10, 12, 13, 15, 17, 19, 20, 22, 24, 26, 27, 29
Tháng 10
8h00: Ngày 02, 03, 04, 07, 09, 10, 11, 14, 16, 17, 18, 20, 21, 23, 25, 28, 30, 31
13h30: 01, 03, 04, 06, 08, 10, 11, 13, 15, 16, 17, 18, 20, 22, 24, 25, 27, 29, 31
Giờ áp dụng: 8h00 hoặc 13h30
Số lượng E-Voucher áp dụng: 01 E-voucher/ 1 khách
Lưu ý:
Trẻ em dưới 3 tuổi miễn phí vé, sử dụng chung chỗ với người lớn, mỗi người lớn được kèm tối đa 01 trẻ em dưới 3 tuổi, từ trẻ em thứ 2 trở lên phải mua vé trẻ em
Trẻ từ 3- 8 tuổi: Giảm 10% so với giá vé người lớn
Khách hàng liên hệ đăng ký dịch vụ trước khi đến để được phục vụ tốt nhất
Điện thoại: 1900 2065
Địa chỉ: Cửa 1C, sảnh Bắc - Ga Hà Nội - 120 Lê Duẩn - Văn Miếu - Hà Nội
Điều kiện khác
E-Voucher không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Vé đã mua không hoàn/ hủy',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-5-cua-o-5_17072026120055.jpg?sign=1b0BZBtqgvyqvv4FR24deg',
        0,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        '4ac941b3-ee44-4971-b04f-40cfac7e4455',
        'Vé Tàu Hà Nội 5 Cửa Ô Toa Ô Chợ Dừa - The Hanoi Train',
        'Toa Ô Chợ Dừa thuộc đoàn tàu du lịch hai tầng siêu hiện đại lần đầu tiên xuất hiện tại Việt Nam.
Không gian văn hóa di động tái hiện trọn vẹn nét đẹp kinh thành Thăng Long xưa cổ kính.
Thiết kế cửa kính mở rộng tối đa giúp du khách dễ dàng ngắm trọn phong cảnh dọc đường.
Nội thất sang trọng, ấm cúng với sức chứa từ 44 đến 65 chỗ ngồi vô cùng thoải mái.
Tích hợp 2 toa check-in riêng biệt giúp bạn lưu lại những bức ảnh kỷ niệm triệu like.
Hành trình ẩm thực và nghệ thuật dân gian độc đáo suốt chuyến đi từ Hà Nội đến Kinh Bắc.',
        750000.00,
        750000.00,
        'Khách hàng áp dụng: Tất cả khách hàng từ 8 tuổi trở lên.
Ngày áp dụng
Tháng 7:
8h00: Ngày 17, 18, 19, 29, 31
13h30: Ngày 18, 19, 28
Tháng 08
8h00: Ngày 01, 02, 05, 07, 08, 09, 12, 14, 15, 16, 19, 21, 22, 23, 26, 28, 29, 30
13h30: Ngày 1, 2, 4, 6, 8, 9, 11, 13, 15, 16, 18, 20, 22, 23, 25, 27, 29, 30
Tháng 09
8h00: Ngày 01, 02, 04, 05, 06, 09, 11, 12, 13, 16, 18, 19, 20, 23, 25, 26, 27, 30
13h30: Ngày 01, 02, 05, 06, 08, 10, 12, 13, 15, 17, 19, 20, 22, 24, 26, 27, 29
Tháng 10
8h00: Ngày 02, 03, 04, 07, 09, 10, 11, 14, 16, 17, 18, 20, 21, 23, 25, 28, 30, 31
13h30: 01, 03, 04, 06, 08, 10, 11, 13, 15, 16, 17, 18, 20, 22, 24, 25, 27, 29, 31
Giờ áp dụng: 8h00 hoặc 13h30
Số lượng E-Voucher áp dụng: 01 E-voucher/ 1 khách
Lưu ý:
Trẻ em dưới 3 tuổi miễn phí vé, sử dụng chung chỗ với người lớn, mỗi người lớn được kèm tối đa 01 trẻ em dưới 3 tuổi, từ trẻ em thứ 2 trở lên phải mua vé trẻ em
Trẻ từ 3- 8 tuổi: Giảm 10% so với giá vé người lớn
Khách hàng liên hệ đăng ký dịch vụ trước khi đến để được phục vụ tốt nhất
Điện thoại: 1900 2065
Địa chỉ: Cửa 1C, sảnh Bắc - Ga Hà Nội - 120 Lê Duẩn - Văn Miếu - Hà Nội
Điều kiện khác
E-Voucher không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Vé đã mua không hoàn/ hủy',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-5-cua-o-1_17072026120043.jpg?sign=H3u_SI-kRDW-4rXNwfCzwg',
        0,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        '11b33872-343b-418a-abc0-a05a1fdaa9ad',
        'Show thực cảnh Anh Hùng Cờ Lau - Hoa Lư Ninh Bình - Hạng CL350 xanh đậm - Trẻ em',
        'Thưởng thức show thực cảnh đỉnh cao tái hiện hành trình của Hoàng đế Đinh Bộ Lĩnh.
Chiêm ngưỡng nghệ thuật kết hợp xiếc, múa, võ thuật và âm nhạc truyền thống đặc sắc, dẫn dắt cảm xúc mãnh liệt.
Không gian thực cảnh nhập vai, tái hiện sống động tinh hoa văn hóa Bắc Bộ xưa.
Trải nghiệm du lịch đêm mới lạ, hấp dẫn, phù hợp cho gia đình, nhóm bạn, du khách yêu văn hóa, lịch sử.
Lan tỏa niềm tự hào dân tộc qua câu chuyện lịch sử hào hùng thời Đại Cồ Việt.
Cơ hội chụp ảnh, check-in cùng khung cảnh cổ kính giữa cố đô Ninh Bình, lưu giữ khoảnh khắc khó quên.
Đặt vé trực tiếp trên LifeLink, nhanh gọn, đảm bảo quyền lợi và giá ưu đãi hấp dẫn.
Khám phá sản phẩm nghệ thuật tiêu biểu, trở thành điểm nhấn trong hành trình trải nghiệm văn hóa - lịch sử miền Bắc.',
        175000.00,
        105000.00,
        'Khách hàng áp dụng: TE (trẻ em)
1m - 1.3m (thường từ 4-8 tuổi)
Dưới 1m miễn phí vé khi ngồi cùng bố mẹ.
Ngày áp dụng:
Tháng 7: 9, 10, 11, 16, 17, 18, 23, 24, 25, 26, 30, 31
Tháng 8: 01, 6, 7, 8, 9, 13, 14, 15, 20, 21, 22, 23, 27, 28, 29, 30
Giờ áp dụng: 20h45 - 21h45
Lưu ý:
Khách hàng vui lòng liên hệ check thông tin trước khi thanh toán, đơn hàng được xử lý booking lấy vé QR code gửi cho khách hàng sau khi thanh toán, nếu không liên hệ lấy vé sẽ không sử dụng được dịch vụ.
Vé đã mua không hoàn hủy
Số lượng E-Voucher áp dụng: 01 E-Voucher/ 1 người
Khách hàng liên hệ đăng ký dịch vụ trước khi đến để được phục vụ tốt nhất
Điện thoại: 19002065
Địa chỉ: Thủy Đình, Phố Cổ Hoa Lư, Ninh Bình
Điều kiện khác
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Anh-hung-co-lau-04_09072026141424.jpg?sign=G0cZR9Eth4yr6Coc3jw8bQ',
        0,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        '2c24153a-8bcc-47c9-8f48-5f6e072e9165',
        'Vé Tàu Hà Nội 5 Cửa Ô Tầng 1 - Toa Ô Cầu Dền, Ô Quan Trưởng, Ô Cầu Giấy, Ô Đống Mác - The Hanoi Train',
        'Vé Tàu Hà Nội 5 Cửa Ô Tầng 1 mang đến trải nghiệm khám phá không gian văn hóa độc đáo trên The Hanoi Train.
Các toa Ô Cầu Dền, Ô Quan Chưởng, Ô Cầu Giấy và Ô Đống Mác được thiết kế theo chủ đề riêng, đậm dấu ấn Thăng Long xưa.
Nội thất hiện đại, sang trọng cùng cửa kính lớn giúp du khách ngắm trọn cảnh đẹp dọc hành trình.
Mỗi chuyến tàu là sự kết hợp hài hòa giữa kiến trúc, nghệ thuật và ẩm thực Hà Nội.
Phù hợp cho khách du lịch, gia đình, nhóm bạn và những người yêu thích trải nghiệm văn hóa.
Đặt vé nhanh chóng, tiện lợi và an tâm cùng LifeLink.',
        550000.00,
        550000.00,
        'Khách hàng áp dụng: Tất cả khách hàng từ 8 tuổi trở lên.
Ngày áp dụng
Tháng 7:
8h00: Ngày 17, 18, 19, 29, 31
13h30: Ngày 18, 19, 28
Tháng 08
8h00: Ngày 01, 02, 05, 07, 08, 09, 12, 14, 15, 16, 19, 21, 22, 23, 26, 28, 29, 30
13h30: Ngày 1, 2, 4, 6, 8, 9, 11, 13, 15, 16, 18, 20, 22, 23, 25, 27, 29, 30
Tháng 09
8h00: Ngày 01, 02, 04, 05, 06, 09, 11, 12, 13, 16, 18, 19, 20, 23, 25, 26, 27, 30
13h30: Ngày 01, 02, 05, 06, 08, 10, 12, 13, 15, 17, 19, 20, 22, 24, 26, 27, 29
Tháng 10
8h00: Ngày 02, 03, 04, 07, 09, 10, 11, 14, 16, 17, 18, 20, 21, 23, 25, 28, 30, 31
13h30: 01, 03, 04, 06, 08, 10, 11, 13, 15, 16, 17, 18, 20, 22, 24, 25, 27, 29, 31
Giờ áp dụng: 8h00 hoặc 13h30
Số lượng E-Voucher áp dụng: 01 E-voucher/ 1 khách
Lưu ý:
Trẻ em dưới 3 tuổi miễn phí vé, sử dụng chung chỗ với người lớn, mỗi người lớn được kèm tối đa 01 trẻ em dưới 3 tuổi, từ trẻ em thứ 2 trở lên phải mua vé trẻ em
Trẻ từ 3- 8 tuổi: Giảm 10% so với giá vé người lớn
Khách hàng liên hệ đăng ký dịch vụ trước khi đến để được phục vụ tốt nhất
Điện thoại: 1900 2065
Địa chỉ: Cửa 1C, sảnh Bắc - Ga Hà Nội - 120 Lê Duẩn - Văn Miếu - Hà Nội
Điều kiện khác
E-Voucher không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Vé đã mua không hoàn/ hủy',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-5-cua-o-4_17072026120044.jpg?sign=IMFLQHmnLePaspbhJ-P3lg',
        1,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        '19e389a2-a61b-4400-a352-f521d7812f78',
        'Vé Tàu Hà Nội 5 Cửa Ô Tầng Xép - Toa Ô Cầu Dền, Ô Quan Chưởng, Ô Cầu Giấy, Ô Đống Mác - The Hanoi Train',
        'Vé Tàu Hà Nội 5 Cửa Ô Tầng Xép mang đến trải nghiệm ngắm cảnh mới lạ trên The Hanoi Train.
Không gian tầng xép được thiết kế hiện đại, tạo cảm giác thoáng đãng và tầm nhìn rộng mở.
Các toa Ô Cầu Dền, Ô Quan Chưởng, Ô Cầu Giấy và Ô Đống Mác tái hiện dấu ấn của Thăng Long ngàn năm văn hiến.
Nội thất sang trọng kết hợp kiến trúc, nghệ thuật và văn hóa Hà Nội trong từng chi tiết.
Hệ thống cửa kính lớn giúp du khách dễ dàng chiêm ngưỡng khung cảnh dọc hành trình.
Đặt vé nhanh chóng, tiện lợi và an tâm cùng LifeLink.',
        650000.00,
        650000.00,
        'Khách hàng áp dụng: Tất cả khách hàng từ 8 tuổi trở lên.
Ngày áp dụng
Tháng 7:
8h00: Ngày 17, 18, 19, 29, 31
13h30: Ngày 18, 19, 28
Tháng 08
8h00: Ngày 01, 02, 05, 07, 08, 09, 12, 14, 15, 16, 19, 21, 22, 23, 26, 28, 29, 30
13h30: Ngày 1, 2, 4, 6, 8, 9, 11, 13, 15, 16, 18, 20, 22, 23, 25, 27, 29, 30
Tháng 09
8h00: Ngày 01, 02, 04, 05, 06, 09, 11, 12, 13, 16, 18, 19, 20, 23, 25, 26, 27, 30
13h30: Ngày 01, 02, 05, 06, 08, 10, 12, 13, 15, 17, 19, 20, 22, 24, 26, 27, 29
Tháng 10
8h00: Ngày 02, 03, 04, 07, 09, 10, 11, 14, 16, 17, 18, 20, 21, 23, 25, 28, 30, 31
13h30: 01, 03, 04, 06, 08, 10, 11, 13, 15, 16, 17, 18, 20, 22, 24, 25, 27, 29, 31
Giờ áp dụng: 8h00 hoặc 13h30
Số lượng E-Voucher áp dụng: 01 E-voucher/ 1 khách
Lưu ý:
Trẻ em dưới 3 tuổi miễn phí vé, sử dụng chung chỗ với người lớn, mỗi người lớn được kèm tối đa 01 trẻ em dưới 3 tuổi, từ trẻ em thứ 2 trở lên phải mua vé trẻ em
Trẻ từ 3- 8 tuổi: Giảm 10% so với giá vé người lớn
Khách hàng liên hệ đăng ký dịch vụ trước khi đến để được phục vụ tốt nhất
Điện thoại: 1900 2065
Địa chỉ: Cửa 1C, sảnh Bắc - Ga Hà Nội - 120 Lê Duẩn - Văn Miếu - Hà Nội
Điều kiện khác
E-Voucher không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Vé đã mua không hoàn/ hủy',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-5-cua-o-6_17072026120047.jpg?sign=H1qxxL82k37ZhP4eNvTxOQ',
        1,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        '5a289e68-8f83-4575-84d2-49a182adfe75',
        'Vé vui chơi trẻ em tại Sâu Kid Playground sau 16h tứ Thứ 2 - Thứ 6',
        'Sâu Kid Playground là khu vui chơi trẻ em trong nhà hiện đại tại ROX Center Goldmark City.
Không gian được thiết kế rộng rãi, sạch sẽ và đảm bảo an toàn cho trẻ trong suốt quá trình vui chơi.
Nhiều khu trò chơi vận động, nhập vai và sáng tạo giúp bé phát triển thể chất, tư duy và kỹ năng giao tiếp.
Địa điểm phù hợp cho các gia đình vui chơi cuối tuần, tổ chức sinh nhật và các hoạt động dành cho trẻ nhỏ.
Đội ngũ nhân viên hỗ trợ tận tình giúp phụ huynh yên tâm khi đưa bé đến trải nghiệm.
LifeLink giúp bạn dễ dàng khám phá và lựa chọn Sâu Kid Playground cho những phút giây vui chơi trọn vẹn cùng gia đình.',
        150000.00,
        135000.00,
        'Khách hàng áp dụng: Bé từ 80cm trở lên
Ngày áp dụng: Thứ 2 - thứ 6
Giờ áp dụng: Sau 16h00 -  22h00
Số lượng E-Voucher áp dụng: 01 voucher/1 bé
Phụ thu Lễ, Tết: Không áp dụng
Lưu ý: 01 vé đi kèm 1 người lớn, từ người lớn thứ 2 phụ thu 50.000VNĐ/ 1 người
Khách hàng liên hệ đăng ký dịch vụ trước khi đến để được phục vụ tốt nhất
Hotline: 037 497 0677
Hotline LifeLink: 1900 2065
Địa chỉ: Tầng 3, Lô 05-06-07 toà ROX Center Goldmark City, 136 Hồ Tùng Mậu, Bắc Từ Liêm, Hà Nội
Điều kiện khác
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Sau-kid-Playground-1_14072026105247.jpg?sign=9MimGUAaj_-N7gJl_Ix3vg',
        0,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        '784622c4-7150-4ced-8d8d-950c0f81e4fd',
        'Vé vui chơi trẻ em tại Sâu Kid Playground trước 16h từ Thứ 2 - Thứ 6',
        'Sâu Kid Playground là khu vui chơi trẻ em trong nhà hiện đại dành cho nhiều độ tuổi.
Không gian được thiết kế an toàn, sạch sẽ và thân thiện với trẻ nhỏ.
Đa dạng trò chơi vận động, sáng tạo và nhập vai giúp bé phát triển toàn diện.
Phù hợp cho hoạt động vui chơi hằng ngày, sinh nhật và các sự kiện dành cho trẻ em.
Tọa lạc tại Tầng 3, ROX Center Goldmark City, thuận tiện cho các gia đình tại Hà Nội.
LifeLink mang đến thông tin và trải nghiệm kết nối giúp phụ huynh dễ dàng lựa chọn điểm vui chơi phù hợp.',
        120000.00,
        108000.00,
        'Khách hàng áp dụng: Bé từ 80cm trở lên
Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 8h00 - Trước 16h00
Số lượng E-Voucher áp dụng: 01 voucher/1 bé
Phụ thu (nếu có) Lễ, Tết: Không áp dụng
Lưu ý: 01 vé đi kèm 1 người lớn, từ người lớn thứ 2 phụ thu 50.000VNĐ/ 1 người
Khách hàng liên hệ đăng ký dịch vụ trước khi đến để được phục vụ tốt nhất
Hotline: 037 497 0677
Hotline LifeLink: 1900 2065
Địa chỉ: Tầng 3, Lô 05-06-07 toà ROX Center Goldmark City, 136 Hồ Tùng Mậu, Bắc Từ Liêm, Hà Nội
Điều kiện khác
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Sau-kid-Playground-2_14072026105244.jpg?sign=tEqpkAhovxPH1Wr0VdIsMg',
        0,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        '101acc9a-1e67-4060-a17c-e75f104438ae',
        'Vé vào cổng khu vui chơi kidzooona AEON MALL Hải Phòng 3F bao gồm Lễ Tết',
        'kidzooona AEON MALL Hải Phòng 3F là khu vui chơi trong nhà dành cho trẻ em với không gian hiện đại và an toàn.
Nhiều khu trò chơi vận động, nhập vai và giáo dục giúp trẻ phát triển thể chất, tư duy và kỹ năng giao tiếp.
Đồ chơi và thiết bị được lựa chọn phù hợp với từng giai đoạn phát triển của trẻ.
Thường xuyên tổ chức các hoạt động như nhảy múa, làm thủ công và trò chơi truyền thống.
Môi trường sạch sẽ, đội ngũ nhân viên được đào tạo bài bản mang đến trải nghiệm vui chơi chất lượng.
LifeLink giúp bạn dễ dàng khám phá kidzooona AEON MALL Hải Phòng 3F và lên kế hoạch cho những buổi vui chơi ý nghĩa.',
        180000.00,
        144000.00,
        'Voucher áp dụng cho Vé vào cổng dành cho 1 bé và 1 người lớn tại kidzooona AEON MALL Hải Phòng Tầng 3 bao gồm Lễ Tết
Voucher không bao gồm vớ/tất.
Khu vui chơi quy định luôn sử dụng vớ/tất, Quý khách vui lòng chuẩn bị vớ/tất trước khi vào khu vui chơi hoặc mua vớ/tất tại quầy.
Nhằm đảm bảo vệ sinh, khu vui chơi yêu cầu luôn mang tất trong suốt thời gian vui chơi.
Lưu ý: Luôn giữ vòng tay cẩn thận để được ra vào nhiều lần trong ngày nhé
Khách hàng áp dụng: Trẻ em 1 tuổi đến dưới 12 tuổi, 01 vé áp dụng cho 01 trẻ + 01 người lớn
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng: 09:00 - 21:00
Số lượng E-Voucher áp dụng: 01 voucher/ 01 bé kèm 01 phụ huynh
Phụ thu (nếu có): 1 bé kèm 1 phụ huynh nếu phát sinh thêm các phụ huynh khác thì phụ thu 20.000VNĐ/ Phụ huynh
Thông tin liên hệ đặt dịch vụ
Hotline hỗ trợ: 1900 2065
Địa chỉ: Lô T347-348, tầng 3, Aeon Mall Hải Phòng Lê Chân, Đ. Hồ Sen Cầu Rào 2, phường Kênh Dương, quận Lê Chân, thành phố Hải Phòng.
Điều kiện khác
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-kidzooona-Hai-Phong_14072026172432.jpg?sign=mz1ehr85fB7VefDj-6Kg_w',
        0,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        '4d75a519-4295-496b-9611-6eadb85946f0',
        'Show thực cảnh Anh Hùng Cờ Lau - Hoa Lư Ninh Bình - Hạng CL250 Xanh nhạt - Trẻ em',
        'Đắm chìm trong show thực cảnh tái hiện lịch sử Đinh Bộ Lĩnh ngay tại trung tâm Ninh Bình.
Bước vào không gian nghệ thuật thực cảnh hấp dẫn, kết hợp xiếc, võ, múa và âm nhạc truyền thống Bắc Bộ.
Thích hợp cho gia đình, nhóm bạn, các cặp đôi và khách trẻ yêu lịch sử, văn hoá Việt.
Chủ đề độc đáo, lan tỏa niềm tự hào dân tộc, phù hợp trải nghiệm check-in và tìm hiểu giá trị di sản.
Show diễn chắt lọc tinh hoa nghệ thuật đa loại hình, mang đến cảm xúc chân thực khó quên.
Sản phẩm du lịch đêm đặc sắc, nâng tầm khám phá Ninh Bình về đêm.
Đặt vé dễ dàng trên LifeLink, nhận ưu đãi và xác nhận nhanh chóng.
Trải nghiệm văn hoá ấn tượng, đặt vé ngay để không bỏ lỡ hành trình trở về với lịch sử Việt.',
        150000.00,
        90000.00,
        'Khách hàng áp dụng: TE (trẻ em)
1m - 1.3m (thường từ 4-8 tuổi)
Dưới 1m miễn phí vé khi ngồi cùng bố mẹ.
Ngày áp dụng:
Tháng 7: 9, 10, 11, 16, 17, 18, 23, 24, 25, 26, 30, 31
Tháng 8: 01, 6, 7, 8, 9, 13, 14, 15, 20, 21, 22, 23, 27, 28, 29, 30
Giờ áp dụng: 20h45 - 21h45
Lưu ý:
Khách hàng vui lòng liên hệ check thông tin trước khi thanh toán, đơn hàng được xử lý booking lấy vé QR code gửi cho khách hàng sau khi thanh toán, nếu không liên hệ lấy vé sẽ không sử dụng được dịch vụ.
Vé đã mua không hoàn hủy
Số lượng E-Voucher áp dụng: 01 E-Voucher/ 1 người
Khách hàng liên hệ đăng ký dịch vụ trước khi đến để được phục vụ tốt nhất
Điện thoại: 19002065
Địa chỉ: Thủy Đình, Phố Cổ Hoa Lư, Ninh Bình
Điều kiện khác
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Anh-hung-co-lau-07_09072026144104.jpg?sign=noAiIqv6_KQgWw7N81SIPg',
        0,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        '1c15a1da-6aca-4165-a893-c3b2ee2b4439',
        'Show thực cảnh Anh Hùng Cờ Lau - Hoa Lư Ninh Bình - Hạng CL250 Xanh nhạt - Người lớn',
        'Thưởng thức show thực cảnh đỉnh cao tái hiện hành trình lịch sử Đinh Bộ Lĩnh đầy hào hùng tại Ninh Bình.
Không gian trình diễn nhập vai, đa loại hình từ võ thuật, múa, xiếc đến âm nhạc truyền thống Bắc Bộ đặc sắc.
Trải nghiệm cảm xúc tự hào dân tộc, khám phá tinh hoa văn hóa Việt Nam cùng gia đình, nhóm bạn hay người thân yêu.
Phù hợp cho mọi đối tượng: du khách, học sinh, gia đình yêu lịch sử và nghệ thuật sân khấu.
Nội dung nghệ thuật đặc sắc với sự phối hợp của nhiều loại hình trình diễn độc đáo trên một sân khấu thực cảnh hoành tráng.
Không gian check-in ấn tượng giữa lòng cố đô xưa, hòa mình vào bầu không khí lịch sử sống động đầy cảm xúc.
Mua vé dễ dàng trên LifeLink nhận ưu đãi tiết kiệm, quy trình nhanh chóng, xác nhận tức thì.
Đặt vé show thực cảnh lịch sử Ninh Bình ngay hôm nay qua LifeLink để không bỏ lỡ trải nghiệm cuốn hút hiếm có!',
        250000.00,
        150000.00,
        'Khách hàng áp dụng: NL (người lớn) từ 1.3m trở lên (thường từ 8 tuổi trở lên)
Ngày áp dụng:
Tháng 7: 9, 10, 11, 16, 17, 18, 23, 24, 25, 26, 30, 31
Tháng 8: 01, 6, 7, 8, 9, 13, 14, 15, 20, 21, 22, 23, 27, 28, 29, 30
Giờ áp dụng: 20h45 - 21h45
Lưu ý:
Khách hàng vui lòng liên hệ check thông tin trước khi thanh toán, đơn hàng được xử lý booking lấy vé QR code gửi cho khách hàng sau khi thanh toán, nếu không liên hệ lấy vé sẽ không sử dụng được dịch vụ.
Vé đã mua không hoàn hủy
Số lượng E-Voucher áp dụng: 01 E-Voucher/ 1 người
Khách hàng liên hệ đăng ký dịch vụ trước khi đến để được phục vụ tốt nhất
Điện thoại: 19002065
Địa chỉ: Thủy Đình, Phố Cổ Hoa Lư, Ninh Bình
Điều kiện khác
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Anh-hung-co-lau-06_09072026142841.jpg?sign=Gw0Gps_pBnwDLWfSg8O0Vg',
        0,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        '8270133a-ef80-4ea5-a716-cc226ce72391',
        'Show thực cảnh Anh Hùng Cờ Lau - Hoa Lư Ninh Bình - Hạng CL350 Xanh đậm - Người lớn',
        'Đắm chìm vào show thực cảnh tái hiện hào hùng lịch sử Đinh Bộ Lĩnh và thời kỳ đầu của Đại Cồ Việt.
Không gian nghệ thuật sống động kết hợp võ thuật, xiếc, múa và âm nhạc truyền thống ấn tượng ngay giữa lòng Cố đô Ninh Bình.
Trải nghiệm nhập vai trong bối cảnh Bắc Bộ xưa, lý tưởng để check-in và ghi lại những khoảnh khắc đẹp khó quên.
Hoàn hảo cho gia đình, nhóm bạn hoặc khách yêu văn hóa, mong muốn cảm nhận tinh hoa lịch sử Việt Nam.
Nghệ thuật đa loại hình giúp khán giả mọi lứa tuổi hòa nhịp, lĩnh hội tinh thần tự hào dân tộc.
Show diễn đặc biệt về đêm, tạo nên sản phẩm du lịch hấp dẫn dành cho du khách khi đến Ninh Bình.
Tiết kiệm tối đa khi đặt vé qua LifeLink, xác nhận nhanh chóng, thuận tiện tận hưởng dịch vụ chất lượng.
Đừng bỏ lỡ – đặt vé trên LifeLink để khám phá Bản Hùng Ca Giữa Lòng Cố Đô và hòa mình vào dòng chảy lịch sử!',
        350000.00,
        210000.00,
        'Khách hàng áp dụng: NL (người lớn) từ 1.3m trở lên (thường từ 8 tuổi trở lên)
Ngày áp dụng:
Tháng 7: 9, 10, 11, 16, 17, 18, 23, 24, 25, 26, 30, 31
Tháng 8: 01, 6, 7, 8, 9, 13, 14, 15, 20, 21, 22, 23, 27, 28, 29, 30
Giờ áp dụng: 20h45 - 21h45
Lưu ý:
Khách hàng vui lòng liên hệ check thông tin trước khi thanh toán, đơn hàng được xử lý booking lấy vé QR code gửi cho khách hàng sau khi thanh toán, nếu không liên hệ lấy vé sẽ không sử dụng được dịch vụ.
Vé đã mua không hoàn hủy
Số lượng E-Voucher áp dụng: 01 E-Voucher/ 1 người
Khách hàng liên hệ đăng ký dịch vụ trước khi đến để được phục vụ tốt nhất
Điện thoại: 19002065
Địa chỉ: Thủy Đình, Phố Cổ Hoa Lư, Ninh Bình
Điều kiện khác
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Anh-hung-co-lau-03_09072026140103.jpg?sign=uHDd324J3DvYGcjMnXdzpg',
        0,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        '4a8b9668-5290-4afa-aba7-edb5e310340f',
        'Show thực cảnh Anh Hùng Cờ Lau - Hoa Lư Ninh Bình - Hạng CL500 màu vàng - Trẻ em',
        'Trải nghiệm thực cảnh đa giác quan
: Thưởng thức hòa quyện võ thuật, xiếc, âm nhạc truyền thống trong không gian Bắc Bộ xưa.
Phù hợp mọi lứa tuổi
: Lý tưởng cho gia đình, nhóm bạn, cặp đôi yêu thích lịch sử, văn hóa và du lịch trải nghiệm độc đáo.
Kể lại hành trình Đinh Bộ Lĩnh
: Theo chân nhân vật lịch sử vĩ đại từ thuở cờ lau đến khi dựng nên Đại Cồ Việt.
Không gian đậm chất Bắc Bộ
: Đắm chìm giữa cảnh vật, âm thanh sống động gợi về thời kỳ bình minh độc lập của dân tộc.
Nghệ thuật trình diễn đa dạng
: Được dàn dựng bởi các nghệ sĩ chuyên nghiệp, kết hợp múa, võ, xiếc đỉnh cao.
Điểm nhấn du lịch đêm Ninh Bình
: Trở thành sản phẩm nghệ thuật không thể bỏ lỡ trong chuyến khám phá Cố đô.
Tiện lợi khi đặt vé trực tuyến
: Đặt trước qua LifeLink để giữ chỗ đẹp, nhận ngay ưu đãi hấp dẫn, xác nhận nhanh chóng.
Đặc biệt chỉ có tại LifeLink
: Săn deal giá tốt, an tâm trải nghiệm văn hóa – giải trí chất lượng cao tại Ninh Bình.',
        250000.00,
        150000.00,
        'Khách hàng áp dụng: TE (trẻ em)
Từ 1m - 1.3m (thường từ 4-8 tuổi)
Dưới 1m miễn phí vé khi ngồi cùng bố mẹ.
Ngày áp dụng:
Tháng 7: 9, 10, 11, 16, 17, 18, 23, 24, 25, 26, 30, 31
Tháng 8: 01, 6, 7, 8, 9, 13, 14, 15, 20, 21, 22, 23, 27, 28, 29, 30
Giờ áp dụng: 20h45 - 21h45
Lưu ý:
Khách hàng vui lòng liên hệ check thông tin trước khi thanh toán, đơn hàng được xử lý booking lấy vé QR code gửi cho khách hàng sau khi thanh toán, nếu không liên hệ lấy vé sẽ không sử dụng được dịch vụ.
Vé đã mua không hoàn hủy
Số lượng E-Voucher áp dụng: 01 E-Voucher/ 1 người
Khách hàng liên hệ đăng ký dịch vụ trước khi đến để được phục vụ tốt nhất
Điện thoại: 19002065
Địa chỉ: Thủy Đình, Phố Cổ Hoa Lư, Ninh Bình
Điều kiện khác
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Anh-hung-co-lau-02_09072026113411.jpg?sign=4G0I-utiVB5xeRQW6cTzIw',
        0,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        'f45b24c3-2fc6-496a-8452-16ac715829c4',
        'Show thực cảnh Anh Hùng Cờ Lau - Hoa Lư Ninh Bình - Hạng CL500 Màu vàng - Người lớn',
        'Trải nghiệm show thực cảnh đặc sắc, tái hiện lịch sử Việt Nam qua hành trình Đinh Bộ Lĩnh.
Không gian sân khấu nhập vai sống động, đưa khán giả bước vào thời kỳ khai sinh độc lập.
Kết hợp nghệ thuật đa loại hình: xiếc, võ thuật, múa và âm nhạc truyền thống Bắc Bộ lôi cuốn.
Lý tưởng cho gia đình, nhóm bạn, các tín đồ khám phá văn hóa Việt Nam và lịch sử dân tộc.
Thông điệp tự hào, truyền cảm hứng mạnh mẽ về giá trị bản sắc dân tộc Việt.
Du lịch đêm độc đáo tại Ninh Bình, hòa mình cùng nghệ thuật và cảm xúc khó quên.
Show diễn được đánh giá cao về dàn dựng, nghệ thuật trình diễn, mang lại trải nghiệm mãn nhãn.
Đặt vé trực tuyến qua LifeLink, nhanh chóng, dễ dàng, nhận ưu đãi hấp dẫn ngay hôm nay!',
        500000.00,
        300000.00,
        'Khách hàng áp dụng: NL (người lớn) từ 1.3m trở lên (thường từ 8 tuổi trở lên)
Ngày áp dụng:
Tháng 7: 9, 10, 11, 16, 17, 18, 23, 24, 25, 26, 30, 31
Tháng 8: 01, 6, 7, 8, 9, 13, 14, 15, 20, 21, 22, 23, 27, 28, 29, 30
Giờ áp dụng: 20h45 - 21h45
Lưu ý:
Khách hàng vui lòng liên hệ check thông tin trước khi thanh toán, đơn hàng được xử lý booking lấy vé QR code gửi cho khách hàng sau khi thanh toán, nếu không liên hệ lấy vé sẽ không sử dụng được dịch vụ.
Vé đã mua không hoàn hủy
Số lượng E-Voucher áp dụng: 01 E-Voucher/ 1 người
Khách hàng liên hệ đăng ký dịch vụ trước khi đến để được phục vụ tốt nhất
Điện thoại: 19002065
Địa chỉ: Thủy Đình, Phố Cổ Hoa Lư, Ninh Bình
Điều kiện khác
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Anh-hung-co-lau-01_09072026113202.jpg?sign=4KDlzuWYSeA2LeMGvoKmJA',
        0,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        '3b29d9b4-3960-40e6-9626-deb21d9ee7b7',
        'Kid''s Box Vincom Royal Island Hải Phòng - Vé vào cổng khu vui chơi bao gồm Lễ Tết',
        'Đưa bé đến không gian vui chơi hiện đại, sắc màu, đầy cảm hứng tại Kid''s Box Vincom Royal Island Hải Phòng.
Thích hợp cho các gia đình có con nhỏ, nhóm bạn, cho bé trải nghiệm vui chơi chủ động mỗi ngày.
Không gian rộng rãi, an toàn với thiết kế thân thiện, nhiều góc check-in cho bố mẹ lưu giữ khoảnh khắc đáng nhớ của con.
Kid''s Box nổi bật giữa lòng thành phố trẻ trung, mang đến lựa chọn giải trí lý tưởng cho các ngày cuối tuần, lễ Tết hoặc dịp sinh nhật bé.
Vé vào cổng linh hoạt, dễ dàng sử dụng, vừa tiết kiệm thời gian vừa bảo đảm trải nghiệm trọn vẹn cho các bé.
Nhiều hoạt động vận động phù hợp từng độ tuổi, giúp bé phát triển thể chất lẫn trí tuệ trong môi trường an toàn.
Đặt vé qua LifeLink để nhận thêm ưu đãi hấp dẫn và tiện ích xác nhận điện tử nhanh chóng, an toàn mỗi lần vui chơi.
Hãy chọn Kid''s Box Vincom Royal Island Hải Phòng cùng LifeLink để tận hưởng ngày vui bùng nổ cho cả gia đình!',
        120000.00,
        96000.00,
        'Voucher áp dụng cho Vé vào cổng dành cho 1 bé và 1 người lớn tại Kid''s Box Vincom Royal Island Hải Phòng bao gồm Lễ Tết
Voucher không bao gồm vớ/tất.
Khu vui chơi quy định luôn sử dụng vớ/tất, Quý khách vui lòng chuẩn bị vớ/tất trước khi vào khu vui chơi hoặc mua vớ/tất tại quầy.
Nhằm đảm bảo vệ sinh, khu vui chơi yêu cầu luôn mang tất trong suốt thời gian vui chơi.
Lưu ý: Luôn giữ vòng tay cẩn thận để được ra vào nhiều lần trong ngày nhé
Khách hàng áp dụng: Trẻ em từ 1 tuổi đến dưới 12 tuổi, 01 vé áp dụng cho 01 trẻ + 01 người lớn
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng: 09:00 - 21:00
Số lượng E-Voucher áp dụng: 01 voucher/ 01 bé kèm 01 phụ huynh
Phụ thu (nếu có) 1 bé kèm 1 phụ huynh nếu phát sinh thêm các phụ huynh khác thì phụ thu 20.000đ/Phụ huynh
Thông tin liên hệ đặt dịch vụ
Hotline hỗ trợ: 1900 2065
Địa chỉ: Lô L3-16, tầng L3, Tòa nhà Vincom Mega Mall Royal Island thuộc lô CCĐT-01, Khu B1, Khu vui chơi giải trí, nhà ở và công viên sinh thái đảo Vũ Yên, Phường Thủy Nguyên, TP. Hải Phòng
Điều kiện khác
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Kidzooona-2_07072026090658.jpg?sign=iZhpYcVAdS5bVfcpVvHDVg',
        0,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        '413fa44a-fd6d-4077-bac4-d6df32f603ca',
        'kidzooona AEON MALL Hải Phòng 2F - Vé vào cổng khu vui chơi bao gồm Lễ Tết',
        'Trải nghiệm không gian vui chơi hiện đại, an toàn tại kidzooona AEON MALL Hải Phòng 2F cho bé thỏa sức khám phá và sáng tạo.
Phù hợp cho gia đình có con nhỏ, nhóm bạn nhỏ tuổi, cặp đôi bố mẹ và bé cùng vui chơi, gắn kết yêu thương.
Thiết kế tươi sáng, khu vực rộng rãi, sạch sẽ với nhiều điểm check-in hấp dẫn ngay trong lòng AEON MALL Hải Phòng.
Luôn chú trọng yếu tố an toàn, vệ sinh; môi trường thân thiện, nhân sự tận tâm và chu đáo đồng hành cùng bé trong mọi hoạt động.
Không gian linh hoạt giúp trẻ phát triển khả năng vận động, khám phá thế giới xung quanh và khơi dậy trí sáng tạo.
Điểm đến lý tưởng cho cả gia đình vào dịp cuối tuần, ngày lễ hoặc bất kỳ ngày nào bé muốn vui chơi, đổi gió.
Khách hàng đặt vé qua LifeLink sẽ được sở hữu ưu đãi hấp dẫn, tiết kiệm thời gian xếp hàng, mua vé tiện lợi mọi lúc mọi nơi.
Đặt vé kidzooona AEON MALL Hải Phòng 2F trên LifeLink để không bỏ lỡ cơ hội cùng bé tận hưởng không gian vui chơi ấn tượng nhất thành phố!',
        150000.00,
        120000.00,
        'Voucher áp dụng cho Vé vào cổng dành cho 1 bé và 1 người lớn tại kidzooona AEON MALL Hải Phòng Tầng 2 bao gồm Lễ Tết
Voucher không bao gồm vớ/tất.
Khu vui chơi quy định luôn sử dụng vớ/tất, Quý khách vui lòng chuẩn bị vớ/tất trước khi vào khu vui chơi hoặc mua vớ/tất tại quầy.
Nhằm đảm bảo vệ sinh, khu vui chơi yêu cầu luôn mang tất trong suốt thời gian vui chơi.
Lưu ý: Luôn giữ vòng tay cẩn thận để được ra vào nhiều lần trong ngày nhé
Khách hàng áp dụng: Trẻ em từ 1 tuổi đến dưới 12 tuổi, 01 vé áp dụng cho 01 trẻ + 01 người lớn
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng: 09:00 đến 21:00
Số lượng E-Voucher áp dụng: 01 voucher/ 01 bé kèm 01 phụ huynh
Phụ thu (nếu có): 1 bé kèm 1 phụ huynh nếu phát sinh thêm các phụ huynh khác thì phụ thu 20.000đ/Phụ huynh
Thông tin liên hệ đặt dịch vụ
Hotline hỗ trợ: 1900 2065
Địa chỉ: Lô T264, tầng 2, Aeon Mall Hải Phòng Lê Chân, Đ. Hồ Sen Cầu Rào 2, phường Kênh Dương, quận Lê Chân, thành phố Hải Phòng.
Điều kiện khác
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Kidzooona-3_07072026090605.jpg?sign=T1impM_63xbzuvOFOJDPmQ',
        0,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        '9a73686e-229b-43ec-b34a-77def3d1b091',
        'kidzooona Hanoi Centre - Vé vào cổng khu vui chơi bao gồm Lễ Tết',
        'Đắm chìm trong không gian giải trí đầy màu sắc tại Kidzooona Hanoi Centre, nơi trẻ nhỏ tha hồ khám phá sáng tạo.
Phù hợp cho gia đình có con nhỏ, nhóm bạn nhỏ, các cặp đôi yêu cuộc sống năng động và sáng tạo.
Khu vui chơi theo phong cách hiện đại, an toàn và thân thiện, mang đến trải nghiệm vui tươi khó quên cho các bé.
Nhiều hoạt động tương tác, gắn kết các thành viên trong gia đình, giúp bé phát triển kỹ năng vận động.
Không gian rộng rãi, sạch sẽ, được thiết kế sáng tạo tạo cảm hứng cho mọi lứa tuổi khi tham gia trải nghiệm.
Ưu đãi hấp dẫn, linh hoạt thời gian vui chơi giúp khách hàng chủ động lựa chọn cho các dịp cuối tuần hoặc ngày lễ.
LifeLink mang đến giải pháp đặt vé nhanh chóng, an toàn, nhiều ưu đãi đặc biệt dành riêng cho khách hàng.
Đặt vé ngay trên LifeLink để tiết kiệm thời gian, nhận mức giá tốt và tận hưởng mùa vui bất tận tại Kidzooona!',
        200000.00,
        160000.00,
        'Voucher áp dụng cho Vé vào cổng dành cho 1 bé và 1 người lớn tại kidzooona Hanoi Centre bao gồm Lễ Tết
Voucher không bao gồm vớ/tất.
Khu vui chơi quy định luôn sử dụng vớ/tất, Quý khách vui lòng chuẩn bị vớ/tất trước khi vào khu vui chơi hoặc mua vớ/tất tại quầy.
Nhằm đảm bảo vệ sinh, khu vui chơi yêu cầu luôn mang tất trong suốt thời gian vui chơi.
Lưu ý: Luôn giữ vòng tay cẩn thận để được ra vào nhiều lần trong ngày nhé
Khách hàng áp dụng: Trẻ em từ 1 tuổi đến dưới 12 tuổi, 01 vé áp dụng cho 01 trẻ + 01 người lớn
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng: 09:00 đến 21:00
Số lượng E-Voucher áp dụng: 01 voucher/ 01 bé kèm 01 phụ huynh
Phụ thu (nếu có): 1 bé kèm 1 phụ huynh nếu phát sinh thêm các phụ huynh khác thì phụ thu 20.000đ/Phụ huynh
Thông tin liên hệ đặt dịch vụ
Hotline hỗ trợ: 1900 2065
Địa chỉ: L2-C10, Tầng 2, Tiến Bộ Plaza, 175 đường Nguyễn Thái Học, Phường Ô Chợ Dừa, TP. Hà Nội.
Điều kiện khác
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Kidzooona-6_07072026085006.jpg?sign=uqAO43sJUYhZ-85GUfLmrQ',
        0,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        '0e0bb123-63f4-4bcc-8f8e-d4708fc3efd6',
        'Tiny kidzooona AEON MALL Long Biên - Vé vào cổng khu vui chơi bao gồm Lễ Tết',
        'Trải nghiệm thế giới vui chơi đầy sáng tạo tại Tiny kidzooona AEON MALL Long Biên, nơi trẻ em tự do khám phá và phát triển năng khiếu.
Lý tưởng cho gia đình có trẻ nhỏ, hội nhóm, hoặc các cặp đôi mong muốn không gian giải trí thư giãn cuối tuần.
Không gian sạch sẽ, an toàn, bài trí sinh động với nhiều góc check-in đẹp mắt, tạo nên tuổi thơ đáng nhớ cho bé.
Đội ngũ nhân viên thân thiện, tận tình hỗ trợ đảm bảo trải nghiệm vui chơi thuận tiện, tràn đầy năng lượng.
Vé vào cổng linh hoạt, không giới hạn địa điểm, dễ dàng cho sự lựa chọn giải trí của từng gia đình.
Lợi ích tiết kiệm khi đặt vé online qua LifeLink, hưởng ưu đãi hấp dẫn, tránh xếp hàng chờ đợi tại quầy.
Khu vui chơi phù hợp nhiều độ tuổi, giúp trẻ khám phá, giao lưu và vận động toàn diện trong môi trường tích cực.
Sẵn sàng đặt vé trên LifeLink để mang về những khoảnh khắc tuyệt vời cùng con yêu tại Tiny kidzooona AEON MALL Long Biên!',
        150000.00,
        120000.00,
        'Voucher áp dụng cho Vé vào cổng dành cho 1 bé và 1 người lớn tại Tiny kidzooona AEON MALL Long Biên bao gồm Lễ Tết
Voucher không bao gồm vớ/tất.
Khu vui chơi quy định luôn sử dụng vớ/tất, Quý khách vui lòng chuẩn bị vớ/tất trước khi vào khu vui chơi hoặc mua vớ/tất tại quầy.
Nhằm đảm bảo vệ sinh, khu vui chơi yêu cầu luôn mang tất trong suốt thời gian vui chơi.
Lưu ý: Luôn giữ vòng tay cẩn thận để được ra vào nhiều lần trong ngày nhé
Khách hàng áp dụng: Trẻ em từ 1 tuổi đến dưới 12 tuổi, 01 vé áp dụng cho 01 trẻ + 01 người lớn
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng: 09:00 đến 21:00
Số lượng E-Voucher áp dụng: 01 voucher/ 01 bé kèm 01 phụ huynh
Phụ thu (nếu có): 1 bé kèm 1 phụ huynh nếu phát sinh thêm các phụ huynh khác thì phụ thu 20.000đ/Phụ huynh
Thông tin liên hệ đặt dịch vụ
Hotline hỗ trợ: 1900 2065
Địa chỉ: Lô 3F-1, tầng 3, Aeon Mall Long Biên, Số 27 đường Cổ Linh, Phường Long Biên, Thành phố Hà Nội.
Điều kiện khác
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Kidzooona-1_06072026165845.jpg?sign=i7-Ey0BBpih6FtzHeLkWvg',
        0,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        '9800abae-0f8b-4b0c-95d5-e166436a0ab3',
        'kidzooona AEON MALL Long Biên - Vé vào cổng khu vui chơi bao gồm Lễ Tết',
        'Thỏa sức khám phá không gian vui chơi sống động, an toàn tại Kid''s Box LOTTE MART Vinh.
Lý tưởng cho gia đình có trẻ nhỏ, nhóm bạn, các em thiếu nhi thỏa đam mê vận động, sáng tạo.
Khu vui chơi thiết kế hiện đại, mang đến trải nghiệm giải trí đa dạng, phù hợp nhiều lứa tuổi.
Địa điểm check-in lý tưởng, giúp các bé lưu giữ những khoảnh khắc tuổi thơ hồn nhiên, rực rỡ.
Môi trường sạch sẽ, thân thiện, chuyên nghiệp với đội ngũ nhân viên hỗ trợ tận tình, chu đáo.
Giá vé ưu đãi đặc biệt chỉ khi đặt qua LifeLink, giúp bố mẹ tiết kiệm chi phí vui chơi cho con.
Đem lại cảm giác an tâm về an ninh, tuyệt đối an toàn để trẻ thỏa sức khám phá, vận động.
Đặt vé trực tuyến qua LifeLink nhanh chóng, linh hoạt – săn deal giá tốt cho ngày trải nghiệm tuyệt vời!',
        190000.00,
        152000.00,
        'Voucher áp dụng cho Vé vào cổng dành cho 1 bé và 1 người lớn tại kidzooona AEON MALL Long Biên bao gồm Lễ Tết
Voucher không bao gồm vớ/tất.
Khu vui chơi quy định luôn sử dụng vớ/tất, Quý khách vui lòng chuẩn bị vớ/tất trước khi vào khu vui chơi hoặc mua vớ/tất tại quầy.
Nhằm đảm bảo vệ sinh, khu vui chơi yêu cầu luôn mang tất trong suốt thời gian vui chơi.
Lưu ý: Luôn giữ vòng tay cẩn thận để được ra vào nhiều lần trong ngày nhé
Khách hàng áp dụng: Trẻ em từ 1 tuổi đến dưới 12 tuổi, 01 vé áp dụng cho 01 trẻ + 01 người lớn
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng: 09:00 đến 21:00
Số lượng E-Voucher áp dụng: 01 voucher/ 01 bé kèm 01 phụ huynh
Phụ thu (nếu có) 1 bé kèm 1 phụ huynh nếu phát sinh thêm các phụ huynh khác thì phụ thu 20.000đ/Phụ huynh
Thông tin liên hệ đặt dịch vụ
Hotline hỗ trợ: 1900 2065
Địa chỉ: Lô T334-1, tầng 3, Aeon Mall Long Biên, Số 27 đường Cổ Linh, Phường Long Biên, Thành phố Hà Nội.
Điều kiện khác
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Kidzooona-7_06072026163043.jpg?sign=Rx5hKRvQQyz0jnQDCylKwA',
        0,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        'cc850deb-b444-4cb0-9bc5-1fda87483fd1',
        'Kid''s Box LOTTE MART Vinh - Vé vào cổng khu vui chơi bao gồm Lễ Tết',
        'Thỏa sức khám phá không gian vui chơi sống động, an toàn tại Kid''s Box LOTTE MART Vinh.
Lý tưởng cho gia đình có trẻ nhỏ, nhóm bạn, các em thiếu nhi thỏa đam mê vận động, sáng tạo.
Khu vui chơi thiết kế hiện đại, mang đến trải nghiệm giải trí đa dạng, phù hợp nhiều lứa tuổi.
Địa điểm check-in lý tưởng, giúp các bé lưu giữ những khoảnh khắc tuổi thơ hồn nhiên, rực rỡ.
Môi trường sạch sẽ, thân thiện, chuyên nghiệp với đội ngũ nhân viên hỗ trợ tận tình, chu đáo.
Giá vé ưu đãi đặc biệt chỉ khi đặt qua LifeLink, giúp bố mẹ tiết kiệm chi phí vui chơi cho con.
Đem lại cảm giác an tâm về an ninh, tuyệt đối an toàn để trẻ thỏa sức khám phá, vận động.
Đặt vé trực tuyến qua LifeLink nhanh chóng, linh hoạt – săn deal giá tốt cho ngày trải nghiệm tuyệt vời!',
        80000.00,
        64000.00,
        'Voucher áp dụng cho Vé vào cổng dành cho 1 bé và 1 người lớn tại Kid''s Box LOTTE MART Vinh bao gồm Lễ Tết
Voucher không bao gồm vớ/tất.
Khu vui chơi quy định luôn sử dụng vớ/tất, Quý khách vui lòng chuẩn bị vớ/tất trước khi vào khu vui chơi hoặc mua vớ/tất tại quầy.
Nhằm đảm bảo vệ sinh, khu vui chơi yêu cầu luôn mang tất trong suốt thời gian vui chơi.
Lưu ý: Luôn giữ vòng tay cẩn thận để được ra vào nhiều lần trong ngày nhé
Khách hàng áp dụng: Trẻ em từ 1 tuổi đến dưới 12 tuổi, 01 vé áp dụng cho 01 trẻ + 01 người lớn
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng: 09:00 - 21:00
Số lượng E-Voucher áp dụng: 01 voucher/ 01 bé kèm 01 phụ huynh
Phụ thu (nếu có) 1 bé kèm 1 phụ huynh nếu phát sinh thêm các phụ huynh khác thì phụ thu 50.000đ/Phụ huynh
Thông tin liên hệ đặt dịch vụ
Hotline hỗ trợ: 1900 2065
Địa chỉ: Lô 3F-11, TTTM Lotte Mart, Đại lộ V.I.Lenin, Khối Yên Sơn, Phường Vinh Phú, Tỉnh Nghệ An.
Điều kiện khác
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Kidzooona-4_06072026172549.jpg?sign=Pw9eUnLolHcg4VF7QbsdkA',
        0,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        'eec0c23b-4b22-4ee4-84d2-38894a98dbbe',
        'kidzooona GO Buôn Ma Thuột - Vé vào cổng khu vui chơi bao gồm Lễ Tết',
        'Khám phá không gian vui chơi năng động của kidzooona GO Buôn Ma Thuột, nơi tràn ngập tiếng cười và sắc màu sáng tạo.
Lý tưởng cho gia đình có trẻ em, nhóm bạn nhỏ hay các cặp đôi muốn thư giãn cuối tuần năng động và an toàn.
Khu vui chơi với cách bài trí hiện đại, đa dạng hoạt động giúp phát triển thể chất và trí tuệ dành cho các em nhỏ.
Môi trường thoáng mát, đảm bảo vệ sinh và an toàn tuyệt đối cho trẻ, luôn có nhân viên sẵn sàng hỗ trợ.
Kidzooona luôn chú trọng trải nghiệm check-in sống động cho bé và gia đình, tạo nên nhiều kỷ niệm khó quên.
Giá vé hợp lý giúp bạn chủ động lựa chọn theo nhu cầu, linh hoạt giờ giấc tham gia.
Mua vé tại LifeLink để nhận ưu đãi hấp dẫn, giao dịch nhanh chóng, thủ tục đơn giản.
Đặt vé kidzooona GO Buôn Ma Thuột qua LifeLink để cả nhà thêm gắn kết và trải nghiệm trọn vẹn.',
        98000.00,
        79000.00,
        'Voucher áp dụng cho Vé vào cổng dành cho 1 bé và 1 người lớn tại kidzooona GO Buôn Ma Thuột bao gồm Lễ Tết
Voucher không bao gồm vớ/tất.
Khu vui chơi quy định luôn sử dụng vớ/tất, Quý khách vui lòng chuẩn bị vớ/tất trước khi vào khu vui chơi hoặc mua vớ/tất tại quầy.
Nhằm đảm bảo vệ sinh, khu vui chơi yêu cầu luôn mang tất trong suốt thời gian vui chơi.
Lưu ý: Luôn giữ vòng tay cẩn thận để được ra vào nhiều lần trong ngày nhé.
Khách hàng áp dụng: Trẻ em từ 1 tuổi đến dưới 12 tuổi, 01 vé áp dụng cho 01 trẻ + 01 người lớn
Ngày áp dụng Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng: 09:00 đến 21:00
Số lượng E-Voucher áp dụng: 01 voucher/ 01 bé kèm 01 phụ huynh
Phụ thu (nếu có) 1 bé kèm 1 phụ huynh nếu phát sinh thêm các phụ huynh khác thì phụ thu 50.000đ/Phụ huynh
Thông tin LH đặt dịch vụ
Hotline hỗ trợ: 1900 2065
Địa chỉ: Lô 2S22-B, TTTM Go! Buôn Ma Thuột, Góc đường Nguyễn Thị Định và đường Vành đai Phía Tây, Phường Thành Nhất, Tỉnh Đắk Lắk
Điều kiện khác
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Kidzooona-3_06072026160832.jpg?sign=KF5EVS8-miOznWH8E82sYw',
        0,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        '5556b7f9-4f98-43b6-a421-ccc5449c2929',
        'kidzooona AEON MALL Tân Phú Celadon - Vé vào cổng khu vui chơi bao gồm Lễ Tết',
        'Trải nghiệm thế giới vui chơi năng động và sáng tạo tại kidzooona AEON MALL Tân Phú Celadon.
Không gian giải trí rộng rãi, ngập tràn sắc màu, mang đến cảm hứng tươi vui cho mọi lứa tuổi.
Điểm đến lý tưởng dành cho gia đình có con nhỏ, nhóm bạn hoặc các cặp đôi cần đổi gió vui chơi cuối tuần.
Được thiết kế đảm bảo an toàn, vệ sinh sạch sẽ, nhân viên nhiệt tình hỗ trợ khách hàng tận tình.
Bé thỏa sức khám phá các khu chủ đề đa dạng, thoải mái vận động, học hỏi và gắn kết bạn bè.
Check-in cùng không gian hiện đại, nhiều góc chụp ảnh đẹp, lưu giữ kỷ niệm trọn vẹn bên người thân.
Ưu đãi hấp dẫn khi đặt vé trước qua LifeLink, chủ động lựa chọn thời gian vui chơi linh hoạt.
Đặt vé kidzooona AEON MALL Tân Phú Celadon trên LifeLink – Cách thông minh để cùng cả gia đình tận hưởng thế giới giải trí vui nhộn!',
        150000.00,
        120000.00,
        'Voucher áp dụng cho Vé vào cổng dành cho 1 bé và 1 người lớn tại kidzooona AEON MALL Tân Phú Celadon bao gồm Lễ Tết
Voucher không bao gồm vớ/tất.
Khu vui chơi quy định luôn sử dụng vớ/tất, Quý khách vui lòng chuẩn bị vớ/tất trước khi vào khu vui chơi hoặc mua vớ/tất tại quầy.
Nhằm đảm bảo vệ sinh, khu vui chơi yêu cầu luôn mang tất trong suốt thời gian vui chơi.
Lưu ý: Luôn giữ vòng tay cẩn thận để được ra vào nhiều lần trong ngày nhé
Khách hàng áp dụng: Trẻ em từ 1 tuổi đến dưới 12 tuổi, 01 vé áp dụng cho 01 trẻ + 01 người lớn
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng: 09:00 - 21:00
Số lượng E-Voucher áp dụng: 01 voucher/ 01 bé kèm 01 phụ huynh
Phụ thu (nếu có): 1 bé kèm 1 phụ huynh nếu phát sinh thêm các phụ huynh khác thì phụ thu 20.000đ/Phụ huynh
Thông tin liên hệ đặt dịch vụ
Hotline hỗ trợ: 1900 2065
Địa chỉ: Lô S19, Tầng 2, AEON Mall Tân Phú Celadon, Số 30, Bờ Bao Tân Thắng, Phường Tân Sơn Nhì, Tp.Hồ Chí Minh.
Điều kiện khác
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Kidzooona-1_06072026154902.jpg?sign=CkR-bMmWjwBEJgipjwQlyQ',
        0,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        'cb0726fc-43cd-4c33-a25b-18bc5eb1c7c8',
        'kidzooona PARC MALL Quận 8 - Vé vào cổng khu vui chơi bao gồm Lễ Tết',
        'Tham gia khu vui chơi kidzooona PARC MALL Quận 8, tận hưởng không gian giải trí đa sắc màu, hiện đại và an toàn cho bé.
Phù hợp hoàn hảo cho gia đình, trẻ nhỏ, nhóm bạn hoặc cặp đôi mong muốn thư giãn, vui chơi cuối tuần.
Kidzooona nổi bật với thiết kế mở, không khí sôi động, khuyến khích hoạt động vận động và trải nghiệm khám phá mới lạ.
Không gian rộng rãi, sạch sẽ, được bố trí hợp lý tạo điều kiện tối đa để các bé tự do vận động, giao lưu cùng bạn bè mới.
Môi trường vui chơi trong nhà, hạn chế tác động thời tiết, thích hợp để bé vui đùa cả ngày mà không lo nắng mưa.
An toàn dành cho trẻ nhỏ với tiêu chuẩn kiểm định nghiêm ngặt, hệ thống nhân viên hỗ trợ tận tình cùng phụ huynh.
Mua vé qua LifeLink giúp tiết kiệm chi phí, thủ tục đặt vé nhanh chóng với nhiều ưu đãi hấp dẫn, tiện lợi ngay tại TP.HCM.
Sẵn sàng nhập cuộc khám phá thế giới vui chơi năng động - Đặt vé kidzooona PARC MALL Quận 8 tại LifeLink để không bỏ lỡ ưu đãi!',
        150000.00,
        120000.00,
        'Voucher áp dụng cho Vé vào cổng dành cho 1 bé và 1 người lớn tại kidzooona PARC MALL Quận 8 bao gồm Lễ Tết
Voucher không bao gồm vớ/tất.
Khu vui chơi quy định luôn sử dụng vớ/tất, Quý khách vui lòng chuẩn bị vớ/tất trước khi vào khu vui chơi hoặc mua vớ/tất tại quầy.
Nhằm đảm bảo vệ sinh, khu vui chơi yêu cầu luôn mang tất trong suốt thời gian vui chơi.
Lưu ý: Luôn giữ vòng tay cẩn thận để được ra vào nhiều lần trong ngày nhé
Khách hàng áp dụng: Áp dụng cho các bé từ 1 tuổi đến dưới 12 tuổi, 01 vé áp dụng cho 01 trẻ + 01 người lớn
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng: từ 09:00 đến 21:00
Số lượng E-Voucher áp dụng: 01 voucher/ 01 bé kèm 01 phụ huynh
Phụ thu (nếu có) 1 bé kèm 1 phụ huynh nếu phát sinh thêm các phụ huynh khác thì phụ thu 20.000đ/Phụ huynh
Thông tin liên hệ đặt dịch vụ
Hotline hỗ trợ: 1900 2065
Địa chỉ: L3-01, Tầng 3, Trung tâm thương mại PARC MALL Q.8, số 547-549 đường Tạ Quang Bửu, Phường Chánh Hưng, TP. Hồ Chí Minh.
Điều kiện khác
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Kizooona-6_06072026150831.jpg?sign=ao45DOy-mfl3KWvnCFMjZA',
        0,
        '40000000-0000-0000-0000-000000000003'
    ),
    (
        '7ee0406b-f97b-4d5a-86a6-c3a6fc3b3386',
        'E-voucher - Hộp bánh trung thu Giao Hảo Hữu',
        'E-voucher - Hộp bánh trung thu Giao Hảo Hữu quy tụ nhiều hương vị bánh đặc sắc, đáp ứng đa dạng sở thích thưởng thức.
Hộp bánh kết hợp bánh nướng và bánh dẻo, tạo nên trải nghiệm Trung thu phong phú.
Các lựa chọn gồm bánh nướng thập cẩm đặc biệt trứng, sen trà ô long trứng và mơ tây.
Bánh dẻo cốm dừa mang đến hương vị nhẹ nhàng, gợi nét truyền thống của mùa đoàn viên.
Sản phẩm đi kèm chai Rượu Đông Trùng Hạ Thảo 700ml Standard, góp phần nâng tầm giá trị hộp quà.
Bao bì hộp và khay định hình được thiết kế đồng bộ, giúp món quà thêm trang trọng và chuyên nghiệp.',
        1522800.00,
        1370000.00,
        'Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 9h00 -17h00
Thông tin liên hệ đặt dịch vụ
Hotline lifelink (9h00-20h00): 1900 2065
Hotline BioFun: 0355983628
Địa chỉ lấy bánh Số 10 ngõ 102 Trần Phú,Mỗ Lao, Hà Đông, Hà Nội
Điều kiện áp dụng:
Áp dụng 01 E-Voucher cho 01 hộp
Một khách hàng được mua nhiều E-Voucher
E-Voucher không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Giá đã bao gồm VAT, chưa bao gồm phí ship',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Giao-Hao-Huu_21082026113751.jpg?sign=wy0fkH9NJ7EGVP29dUXfyQ',
        0,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        'fa21c7a2-e49a-4a19-a1a2-a9b75507a98c',
        'E-voucher - Hộp bánh trung thu Trăng Cát Tường',
        'Thương hiệu BioFun, phù hợp với nhu cầu quà tặng Trung Thu chỉn chu.
Gồm bánh dẻo thập cẩm cao cấp với hương vị đậm đà, hấp dẫn.
Bánh dẻo cốm dừa mang vị thơm dịu, mềm mịn và đặc trưng.
Kèm 1 hộp Đông Trùng Hạ Thảo Sinh Khối Tươi Ngâm Mật Ong BioFun.
Bao bì hộp và khay định hình được thiết kế đồng bộ, sang trọng.
Sự kết hợp giữa bánh và sản phẩm BioFun tạo nên hộp quà đa dạng, giàu ý nghĩa.
Phù hợp làm quà biếu gia đình, quà tặng khách hàng, đối tác và doanh nghiệp.',
        669600.00,
        603000.00,
        'Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 9h00 -17h00
Thông tin liên hệ đặt dịch vụ
Hotline lifelink (9h00-20h00): 1900 2065
Hotline BioFun: 0355983628
Địa chỉ lấy bánh Số 10 ngõ 102 Trần Phú,Mỗ Lao, Hà Đông, Hà Nội
Điều kiện áp dụng:
Áp dụng 01 E-Voucher cho 01 hộp
Một khách hàng được mua nhiều E-Voucher
E-Voucher không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Giá đã bao gồm VAT, chưa bao gồm phí ship',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/Set-Trang-Cat-Tuong_21082026104056.jpg?sign=Y5F3llhje1bRmLcBqFEIRg',
        0,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        '3da94790-34d5-4856-85e4-946f489928c8',
        'Aurora Halong Cruises - Tour đón bình minh trên vịnh Hạ Long',
        'Du thuyền Aurora Halong Cruises 5 sao, hành trình đón bình minh trên Vịnh Hạ Long.
Trải nghiệm riêng tư, sang trọng, rộng rãi, thoải mái cho mọi du khách.
Thưởng thức ẩm thực Á - Âu thượng hạng, buffet và set menu tinh tế.
Jacuzzi bốn mùa trên boong, thư giãn với tầm nhìn toàn cảnh Vịnh.
Nhà hàng view vịnh sức chứa 120 khách, hệ thống âm thanh - ánh sáng hiện đại.
Lịch trình tham quan hấp dẫn: Động Thiên Cung, Hòn Lư Hương, Hòn Con Vịt, Hòn Trống Mái.
Dịch vụ nhân viên chuẩn 5 sao, chuyên nghiệp và tận tâm.',
        950000.00,
        850000.00,
        'Ngày áp dụng
: Thứ 2 - chủ nhật
Thời gian áp dụng theo lịch trình:
07h00 -11h00
Số lượng E-Voucher áp dụng
: 01 E-voucher/ 1 người
Dịch vụ bao gồm:
Lịch trình 4 tiếng trên tàu thăm quan Vịnh + bữa Brunch)
Du thuyền sang trọng, tiêu chuẩn 5 sao
Điều hòa suốt hành trình trên du thuyền
01 Bữa trưa Buffet Âu - Á thượng hạng trên du thuyền
01 Bữa Brunch/ 01 bữa tối đối với chương trình tour sáng/ tối
Đồ uống chào mừng. khăn lạnh trên du thuyền
Tour tham quan 4 tiếng: Tham quan hang Sửng Sốt; Tắm biển, leo núi tại Đảo Titop;
Chèo thuyền Kayak hoặc ngồi thuyền nan tham quan hang Luồn. Tiệc hoàng hôn:
Nước ép trái cây, trái cây và bánh ngọt.
Bể sục Jacuzzi
Khăn tắm phục vụ miễn phí
Phí tham quan và vé thắng cảnh theo chương trình
Bảo hiểm theo vé tham quan
Chụp ảnh bằng flycam hoặc máy cơ
Dịch vụ không bao gồm:
Đồ uống order tại quầy bar, tiền Tip và chi phí cá nhân khác
Xe limousine hiện đại hai chiều cao tốc từ Phố Cổ Hà Nội - Tuần Châu - Hà Nội: 17 - 22 ghế (phụ thu 400.000 Vnđ/ 2 chiều, Xe shuttle bus 30 ghế: 300.000 vnd/ khách/ 2 chiều)
Nước khoáng trên xe Limousine: 2 chai/2 chiều/khách
Thuế VAT 8% và phụ phí
Thanh toán bằng thẻ trên tàu: 4-5% phí ngân hàng
Phụ thu:
Trẻ từ 1 đến 4 tuổi: Miễn phí cho 1 trẻ đi cùng đoàn 20 người lớn; trẻ thứ 2 phụ thu 200.000 vnđ. Nếu trẻ cao trên 1,2m, phụ huynh tự chi trả phát sinh vé tham quan nếu có.
Trẻ từ 5 đến 8 tuổi: Tính 75% giá người lớn.
Trẻ từ 9 tuổi trở lên: Tính 100% giá người lớn.
Phụ thu lễ 30/4, 1/5, 2/9: 100.000 vnđ/khách.
Thông tin liên hệ:
Hotline: 19002065
Điều kiện khác:
E-voucher không có giá trị quy đổi thành tiền mặt.
Không trả lại tiền thừa khi sử dụng dịch vụ.
Không áp dụng đồng thời với chương trình khuyến mại khác.
Không hoàn/hủy booking sau khi xác nhận.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/1_27052026115347.jpg?sign=HtSwInTcSNqP17pCCYhpeQ',
        0,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        '82e65301-9fe0-4cf6-b866-48a82c5250f5',
        'E-voucher - Hộp bánh trung thu Trăng Trường Thọ',
        'E-voucher - Hộp bánh trung thu Trăng Trường Thọ sở hữu 4 hương vị bánh đa dạng, từ thanh tao đến đậm đà, phù hợp nhiều khẩu vị.
Bánh nướng sen Đông Trùng Hạ Thảo tạo điểm nhấn đặc biệt với sự kết hợp giữa vị sen và Đông Trùng Hạ Thảo.
Bánh nướng sen yến kỳ tử mè đen mang đến hương vị hài hòa, lạ miệng và tinh tế.
Bánh nướng matira cafe đem lại sắc vị hiện đại, phù hợp với người yêu thích hương cà phê.
Bánh dẻo thập cẩm cao cấp gợi nét truyền thống quen thuộc của mùa đoàn viên.
Hộp quà còn kết hợp Đông Trùng Hạ Thảo Sinh Khối Khô 5g và nước uống Đông Trùng Hạ Thảo BIOK hộp 10 gói, tạo nên món quà đa dạng và ý nghĩa.',
        1760400.00,
        1584000.00,
        'Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 9h00 -17h00
Thông tin liên hệ đặt dịch vụ
Hotline lifelink (9h00-20h00): 1900 2065
Hotline BioFun: 0355983628
Địa chỉ lấy bánh Số 10 ngõ 102 Trần Phú,Mỗ Lao, Hà Đông, Hà Nội
Điều kiện áp dụng:
Áp dụng 01 E-Voucher cho 01 hộp
Một khách hàng được mua nhiều E-Voucher
E-Voucher không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Giá đã bao gồm VAT, chưa bao gồm phí ship',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Trung-Thu-Trang-Truong-Tho_21082026114325.jpg?sign=dWd4PufgVftfcD5bQJQvdA',
        1,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        'c87130b3-062b-4fb0-bf85-21c53678e07c',
        'E-voucher - Hộp bánh trung thu Trăng Bình An',
        'Thương hiệu BioFun, mang đến lựa chọn quà Trung Thu chỉn chu và ý nghĩa.
Gồm bánh nướng thập cẩm đặc biệt trứng với hương vị đậm đà, quen thuộc.
Bánh nướng sen trà ô long trứng tạo điểm nhấn thanh tao, hài hòa.
Kèm hộp trà Đông trùng hạ Thảo BioFun gồm 20 gói tiện lợi.
Bao bì hộp và khay định hình được thiết kế đồng bộ, đẹp mắt.
Có thể in logo thương hiệu chuyên biệt, phù hợp làm quà tặng doanh nghiệp.
Là món quà phù hợp để trao gửi lời chúc bình an trong mùa đoàn viên.',
        810000.00,
        729000.00,
        'Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 9h00 -17h00
Thông tin liên hệ đặt dịch vụ
Hotline lifelink (9h00-20h00): 1900 2065
Hotline BioFun: 0355983628
Địa chỉ lấy bánh Số 10 ngõ 102 Trần Phú,Mỗ Lao, Hà Đông, Hà Nội
Điều kiện áp dụng:
Áp dụng 01 E-Voucher cho 01 hộp
Một khách hàng được mua nhiều E-Voucher
E-Voucher không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Giá đã bao gồm VAT, chưa bao gồm phí ship',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Trang-Binh-An_21082026103954.jpg?sign=tPZbZy5LIFs6OXjbrWkciQ',
        0,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        'f6e9d57d-04a1-42b0-bb00-5b8e66915b39',
        'Buffet chay tươi ngon áp dụng tại Nhà hàng Chay Tầm Vị',
        'Hơn 50 món chay thay đổi mỗi ngày, mang đến thực đơn đa dạng và trải nghiệm mới mẻ trong mỗi lần ghé thăm.
Món ăn được chế biến từ nguyên liệu tươi ngon, thanh đạm nhưng vẫn đậm đà, hấp dẫn và dễ thưởng thức.
Kết hợp tinh hoa ẩm thực Á – Âu hiện đại, tạo nên những hương vị chay phong phú, phù hợp với nhiều khẩu vị.
Không gian nhà hàng sang trọng, yên tĩnh và ấm cúng, lý tưởng để tận hưởng một bữa ăn thư thái.
Buffet chay phù hợp cho gia đình, bạn bè, đồng nghiệp và những buổi gặp gỡ cần sự gần gũi, riêng tư.
Không chỉ mang đến những món ăn ngon, Chay Tầm Vị còn hướng đến trải nghiệm bình yên, nhẹ nhàng và chữa lành tâm hồn.
Một lựa chọn lý tưởng để thưởng thức ẩm thực thanh lành, kết nối với người thân và tận hưởng những phút giây an nhiên.',
        119000.00,
        109000.00,
        'Khách hàng áp dụng: Tất cả khách hàng
Ngày áp dụng: Thứ 2- chủ nhật, không áp dụng ngày rằm và mùng 1 âm lịch
Giờ áp dụng:
Trưa: 11:00 – 14:00
Tối: 18:00 – 21:00
Số lượng E-Voucher áp dụng: 1 voucher/ 1 khách
Thông tin liên hệ đặt dịch vụ:
Hotline lifelink (9h00-20h00): 1900 2065
Hotline nhà hàng: 0986 896 030
Địa chỉ: 50B Châu Long - Ba Đình - Hà Nội
Điều kiện khác
Áp dụng 01 E-Voucher cho 01 khách
Một khách hàng được mua nhiều E-Voucher
E-Voucher không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Chay-Tam-Vi_12082026142301.jpg?sign=5x9dQFK6ItK4PE_RVVSr9g',
        0,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        '57001615-6abb-4958-8343-f2a1a9829327',
        'Evoucher Hộp quà trung thu Thanh Liên Thưởng Lãm II 2026 phiên bản hộp xếp 2 cánh cửa cao cấp - Combo 6 bánh',
        'Evoucher Hộp quà trung thu Thanh Liên Thưởng Lãm II 2026 phiên bản hộp xếp 2 cánh cửa cao cấp - Combo 6 bánh sở hữu thiết kế hộp cánh mở hiện đại, sang trọng.
Hộp quà được ép kim vàng 9999 tinh xảo, kích thước 36 x 28 x 8 cm, tạo ấn tượng cao cấp khi trao tặng.
Khách hàng được lựa chọn 1 trong 2 combo GVS, mỗi combo gồm 6 bánh với sự kết hợp giữa hương vị truyền thống và hiện đại.
Thiết kế lấy cảm hứng từ đầm sen, núi non, dòng nước và khung cảnh thưởng trà, gửi gắm thông điệp về sự an yên, hòa hợp và viên mãn.
Hộp quà đi kèm túi giấy Ivory sang trọng, thiệp Trung Thu và bộ dao nĩa, hoàn thiện một set quà chỉn chu.
Sản phẩm đặc biệt phù hợp làm quà tặng doanh nghiệp, khách hàng, đối tác và người thân trong dịp Trung Thu 2026.
Đây là lựa chọn giúp người tặng thể hiện sự trân trọng, lời tri ân và mong muốn gắn kết những mối quan hệ bền lâu.',
        839000.00,
        710000.00,
        'Khách hàng áp dụng: Tất cả khách hàng
Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 9:00 - 17:00
Số lượng E-Voucher áp dụng: Sử dụng 01 voucher/01 hộp quà. Không giới hạn số lượng voucher/ hóa đơn.
Thông tin cách mua hàng HƯỚNG DẪN ĐỔI VOUCHER
Bước 1. Khách hàng nhận voucher liên hệ GIVISTA để đổi hộp quà Trung Thu 2026
Hotline/Zalo: 0969117926
Facebook:
Tại đây
Bước 2. Cung cấp mã voucher để đổi hộp quà
Bước 3. Khách hàng thanh toán phí vận chuyển trực tiếp cho đơn vị vận chuyển
Lưu ý: Không hỗ trợ khách hàng đổi quà trực tiếp tại cửa hàng
Điều kiện khác
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Voucher chưa bao gồm phí vận chuyển Hộp quà tặng đến khách hàng.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Thanh-Lien-Thuong-Lam-II-6banh_12082026095120.jpg?sign=qhKdPgegiTa-gnU57udeOw',
        0,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        'd630714b-591e-4a51-a6fe-770fba50ea0b',
        'Evoucher Hộp quà trung thu Lam Tước Vọng Nguyệt 2026 hộp 2 tầng cao cấp 2 cánh ép kim vàng - Combo 4 bánh và trà',
        'Hộp quà Trung Thu Lam Tước Vọng Nguyệt 2026 thiết kế 2 tầng cao cấp, 2 cánh ép kim vàng 9999, tạo ấn tượng sang trọng ngay từ ánh nhìn đầu tiên.
Khách hàng được lựa chọn 1 trong 2 combo bánh, đáp ứng đa dạng sở thích thưởng thức và nhu cầu biếu tặng.
Combo GVS 01 kết hợp các vị bánh truyền thống và hiện đại như thập cẩm, gà quay Jambon, lưu sa hoàng kim và lưu sa socola.
Combo GVS 02 mang đến những hương vị đặc sắc như tôm hùm sốt Hong Kong, bào ngư & sò điệp sốt XO, cốm dừa và đậu xanh hạt chia.
Hộp quà đi kèm trà lài thượng hạng, thiệp Trung Thu, túi giấy Ivory sang trọng và bộ dao nĩa tiện dụng.
Kích thước hộp 35 x 15 x 20 cm, phù hợp làm quà tặng doanh nghiệp, đối tác, khách hàng, gia đình và người thân.
Evoucher Hộp quà trung thu Lam Tước Vọng Nguyệt 2026 hộp 2 tầng cao cấp 2 cánh ép kim vàng - Combo 4 bánh và trà là lựa chọn lý tưởng để trao gửi lời chúc đoàn viên theo cách tinh tế và đẳng cấp.',
        1299000.00,
        1100000.00,
        'Khách hàng áp dụng: Tất cả khách hàng
Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 9:00 - 17:00
Số lượng E-Voucher áp dụng: Sử dụng 01 voucher/01 hộp quà. Không giới hạn số lượng voucher/ hóa đơn.
Thông tin cách mua hàng HƯỚNG DẪN ĐỔI VOUCHER
Bước 1. Khách hàng nhận voucher liên hệ GIVISTA để đổi hộp quà Trung Thu 2026
Hotline/Zalo: 0969117926
Facebook:
Tại đây
Bước 2. Cung cấp mã voucher để đổi hộp quà
Bước 3. Khách hàng thanh toán phí vận chuyển trực tiếp cho đơn vị vận chuyển
Lưu ý: Không hỗ trợ khách hàng đổi quà trực tiếp tại cửa hàng
Điều kiện khác
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Voucher chưa bao gồm phí vận chuyển Hộp quà tặng đến khách hàng.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Lam-Tuoc-Vong-Nguyet_12082026090237.jpg?sign=yBoGV1DmzeFn9WbaoC6jdA',
        0,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        'fd22a49b-d4a9-4f91-b8c3-899adb9e1c65',
        'Evoucher Hộp quà trung thu Cửu Hạc Chi Phúc 2026 phiên bản 2 tầng hiệu ứng 3D cao cấp - Combo 4 bánh và trà',
        'Thiết kế hộp 2 tầng hiệu ứng 3D độc đáo, tạo trải nghiệm mở quà ấn tượng.
Hộp ép kim vàng 9999, kích thước 28 x 18 x 16 cm, mang diện mạo cao cấp.
Hình tượng chín cánh hạc vàng vút bay quanh vầng trăng, giàu tính biểu tượng.
Khách hàng được lựa chọn 1 trong 2 combo gồm 4 bánh Trung Thu với nhiều hương vị.
Đi kèm trà lài thượng hạng, túi giấy Ivory, thiệp Trung Thu và bộ dao nĩa.
Hộp có giá trị lưu giữ lâu dài, có thể sử dụng như vật phẩm trang trí sau mùa lễ.
Phù hợp làm quà tri ân khách hàng, đối tác và nhân viên trong dịp Trung Thu 2026.',
        855000.00,
        720000.00,
        'Khách hàng áp dụng: Tất cả khách hàng
Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 9:00 - 17:00
Số lượng E-Voucher áp dụng: Sử dụng 01 voucher/01 hộp quà. Không giới hạn số lượng voucher/ hóa đơn.
Thông tin cách mua hàng HƯỚNG DẪN ĐỔI VOUCHER
Bước 1. Khách hàng nhận voucher liên hệ GIVISTA để đổi hộp quà Trung Thu 2026
Hotline/Zalo: 0969117926
Facebook:
Tại đây
Bước 2. Cung cấp mã voucher để đổi hộp quà
Bước 3. Khách hàng thanh toán phí vận chuyển trực tiếp cho đơn vị vận chuyển
Lưu ý: Không hỗ trợ khách hàng đổi quà trực tiếp tại cửa hàng
Điều kiện khác
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Voucher chưa bao gồm phí vận chuyển Hộp quà tặng đến khách hàng.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Cuu-Hac-Chi-Phuc-4banh_11082026171157.jpg?sign=FOfej3_ZdU2iEqbZ2a8Wfw',
        0,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        '59cb3dea-5b60-40aa-8df5-472a664671c7',
        'Evoucher Hộp quà Trung Thu Garden Of The Moon 2026 phiên bản hộp Vali Popup 3D cao cấp - Comb 6 bánh',
        'Combo gồm 6 bánh Trung Thu 150g với nhiều hương vị phong phú.
Hộp Vali Popup 3D cao cấp ép kim vàng 9999, kích thước 38 x 26 x 8,5 cm.
Thiết kế gam xanh đêm sang trọng, lấy cảm hứng từ khu vườn huyền ảo dưới ánh trăng.
Hiệu ứng Popup 3D tạo trải nghiệm mở quà độc đáo và giàu tính nghệ thuật.
Đi kèm túi giấy Ivory sang trọng, thiệp Trung Thu và bộ dao nĩa.
Họa tiết chú hươu, hoa lá, mây trời và ánh trăng mang thông điệp về bình an, cân bằng và thịnh vượng.
Phù hợp làm quà tri ân khách hàng, đối tác và nhân viên trong mùa Trung Thu 2026.',
        989000.00,
        840000.00,
        'Khách hàng áp dụng: Tất cả khách hàng
Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 9:00 - 17:00
Số lượng E-Voucher áp dụng: Sử dụng 01 voucher/01 hộp quà. Không giới hạn số lượng voucher/ hóa đơn.
Thông tin cách mua hàng HƯỚNG DẪN ĐỔI VOUCHER
Bước 1. Khách hàng nhận voucher liên hệ GIVISTA để đổi hộp quà Trung Thu 2026
Hotline/Zalo: 0969117926
Facebook:
Tại đây
Bước 2. Cung cấp mã voucher để đổi hộp quà
Bước 3. Khách hàng thanh toán phí vận chuyển trực tiếp cho đơn vị vận chuyển
Lưu ý: Không hỗ trợ khách hàng đổi quà trực tiếp tại cửa hàng
Điều kiện khác
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Voucher chưa bao gồm phí vận chuyển Hộp quà tặng đến khách hàng.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Garden-Of-The-Moon-6banh_11082026163625.jpg?sign=zHr5FYv9YnJCEypqeFxhrg',
        0,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        'fed66cbc-3cd4-4e69-b54e-7ca3eda18c93',
        'Evoucher Hộp quà Trung Thu Garden Of The Moon 2026 phiên bản Vali Popup 3D cao cấp - Combo 4 bánh và trà',
        'Thiết kế Vali Popup 3D cao cấp, lấy cảm hứng từ khu vườn huyền ảo dưới ánh trăng.
Hộp ép kim vàng 9999, kích thước 38 x 26 x 8,5 cm, tạo diện mạo sang trọng và nổi bật.
Khách hàng được lựa chọn 1 trong 2 combo gồm 4 bánh Trung Thu với nhiều hương vị đa dạng.
Kèm 1 trà lài thượng hạng, giúp hoàn thiện trải nghiệm thưởng bánh và thưởng trà.
Có túi giấy Ivory, thiệp Trung Thu và bộ dao nĩa đi kèm.
Họa tiết chú hươu, hoa lá, mây trời và ánh trăng tạo nên dấu ấn nghệ thuật riêng biệt.
Phù hợp làm quà tri ân khách hàng, đối tác, nhân viên trong mùa Trung Thu 2026.',
        699000.00,
        590000.00,
        'Khách hàng áp dụng: Tất cả khách hàng
Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 9:00 - 17:00
Số lượng E-Voucher áp dụng: Sử dụng 01 voucher/01 hộp quà. Không giới hạn số lượng voucher/ hóa đơn.
Thông tin cách mua hàng HƯỚNG DẪN ĐỔI VOUCHER
Bước 1. Khách hàng nhận voucher liên hệ GIVISTA để đổi hộp quà Trung Thu 2026
Hotline/Zalo: 0969117926
Facebook:
Tại đây
Bước 2. Cung cấp mã voucher để đổi hộp quà
Bước 3. Khách hàng thanh toán phí vận chuyển trực tiếp cho đơn vị vận chuyển
Lưu ý: Không hỗ trợ khách hàng đổi quà trực tiếp tại cửa hàng
Điều kiện khác
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Voucher chưa bao gồm phí vận chuyển Hộp quà tặng đến khách hàng.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/Garden-of-the-Moon-4banh_11082026160402.jpg?sign=FKMYZSPp8h2DaQtnQPrahQ',
        0,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        '65a43069-7337-4ea8-ac20-0f7226a8a193',
        'Evoucher Hộp quà Trung Thu Đồng Lạc I 2026 phiên bản hộp Vai Popup 3D cao cấp - Combo 6 bánh',
        'Combo gồm 6 bánh Trung Thu 150g với nhiều hương vị đa dạng, phù hợp để thưởng thức và chia sẻ.
Hộp Vali Popup 3D cao cấp ép kim vàng 9999, kích thước 38 x 26 x 8,5 cm.
Thiết kế lấy cảm hứng từ không khí đêm hội Trung Thu, giàu màu sắc văn hóa và tinh thần đoàn viên.
Kèm túi giấy Ivory sang trọng, giúp món quà hoàn chỉnh và thuận tiện khi trao tặng.
Có thiệp Trung Thu để doanh nghiệp gửi lời chúc và thông điệp riêng đến người nhận.
Tặng kèm bộ dao nĩa, tăng tính tiện dụng khi thưởng thức bánh.
Phù hợp làm quà tri ân khách hàng, đối tác và nhân viên trong mùa Trung Thu 2026.',
        989000.00,
        840000.00,
        'Khách hàng áp dụng: Tất cả khách hàng
Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 9:00 - 17:00
Số lượng E-Voucher áp dụng: Sử dụng 01 voucher/01 hộp quà. Không giới hạn số lượng voucher/ hóa đơn.
Thông tin cách mua hàng HƯỚNG DẪN ĐỔI VOUCHER
Bước 1. Khách hàng nhận voucher liên hệ GIVISTA để đổi hộp quà Trung Thu 2026
Hotline/Zalo: 0969117926
Facebook:
Tại đây
Bước 2. Cung cấp mã voucher để đổi hộp quà
Bước 3. Khách hàng thanh toán phí vận chuyển trực tiếp cho đơn vị vận chuyển
Lưu ý: Không hỗ trợ khách hàng đổi quà trực tiếp tại cửa hàng
Điều kiện khác
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Voucher chưa bao gồm phí vận chuyển Hộp quà tặng đến khách hàng.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-rung-Thu-Dong-Lac-I-6banh_11082026154111.jpg?sign=oIqknwNJxKZcv1CZ7fqpWQ',
        0,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        '3ff1ae81-24e5-40b7-b62c-ab0ad2ab4480',
        'Evoucher Hộp quà Trung Thu Đồng Lạc I 2026 phiên bản Popup 3D cao cấp - Combo 4 bánh và trà',
        'Thiết kế hộp vali Popup 3D cao cấp, ép kim vàng 9999, kích thước 38 x 26 x 8,5 cm.
Khách hàng được lựa chọn 1 trong 2 combo bánh với các hương vị phong phú.
Combo gồm 4 bánh Trung Thu 150g, mang đến sự đa dạng trong trải nghiệm thưởng thức.
Kèm 1 hộp trà lài thượng hạng, bộ dao nĩa, thiệp Trung Thu và túi giấy Ivory sang trọng.
Họa tiết lấy cảm hứng từ không khí đêm hội trăng rằm, giàu màu sắc văn hóa truyền thống.
Phù hợp làm quà tri ân khách hàng, đối tác, nhân viên và quà tặng doanh nghiệp dịp Trung Thu 2026.',
        699000.00,
        590000.00,
        'Khách hàng áp dụng: Tất cả khách hàng
Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 9:00 - 17:00
Số lượng E-Voucher áp dụng: Sử dụng 01 voucher/01 hộp quà. Không giới hạn số lượng voucher/ hóa đơn.
Thông tin cách mua hàng HƯỚNG DẪN ĐỔI VOUCHER
Bước 1. Khách hàng nhận voucher liên hệ GIVISTA để đổi hộp quà Trung Thu 2026
Hotline/Zalo: 0969117926
Facebook:
Tại đây
Bước 2. Cung cấp mã voucher để đổi hộp quà
Bước 3. Khách hàng thanh toán phí vận chuyển trực tiếp cho đơn vị vận chuyển
Lưu ý: Không hỗ trợ khách hàng đổi quà trực tiếp tại cửa hàng
Điều kiện khác
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Voucher chưa bao gồm phí vận chuyển Hộp quà tặng đến khách hàng.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Trung-thu-Dong-Lac-I-4banh_11082026151346.jpg?sign=daNqvy-H-X5LAnGNU2EvKg',
        0,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        'e56f30d6-97e1-4253-8f70-19fa4a7929d9',
        'Evoucher - Hộp quà trung thu Cửu Hạc Diên Niên 2026 phiên bản hộp Vali Popup 3D cao cấp - Combo 6 bánh',
        'Combo gồm 6 bánh Trung Thu 150g với nhiều hương vị đặc sắc, đáp ứng đa dạng khẩu vị người thưởng thức.
Hộp vali Popup 3D kích thước 38 x 26 x 8,5 cm, thiết kế xanh ngọc thanh nhã, tạo ấn tượng ngay từ ánh nhìn đầu tiên.
Hộp được hoàn thiện bằng kỹ thuật ép kim vàng 9999, mang vẻ đẹp cao cấp và sang trọng.
Đi kèm túi giấy Ivory, thiệp Trung Thu và bộ dao nĩa, tạo nên một bộ quà tặng chỉn chu.
Hình tượng cửu hạc mang thông điệp về trường tồn, thịnh vượng và những mối quan hệ bền vững.
Thiết kế hộp có giá trị lưu giữ, có thể tận dụng làm vật phẩm trang trí hoặc lưu trữ sau mùa Trung Thu.',
        989000.00,
        840000.00,
        'Khách hàng áp dụng: Tất cả khách hàng
Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 9:00 - 17:00
Số lượng E-Voucher áp dụng: Sử dụng 01 voucher/01 hộp quà. Không giới hạn số lượng voucher/ hóa đơn.
Thông tin cách mua hàng HƯỚNG DẪN ĐỔI VOUCHER
Bước 1. Khách hàng nhận voucher liên hệ GIVISTA để đổi hộp quà Trung Thu 2026
Hotline/Zalo: 0969117926
Facebook:
Tại đây
Bước 2. Cung cấp mã voucher để đổi hộp quà
Bước 3. Khách hàng thanh toán phí vận chuyển trực tiếp cho đơn vị vận chuyển
Lưu ý: Không hỗ trợ khách hàng đổi quà trực tiếp tại cửa hàng
Điều kiện khác
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Voucher chưa bao gồm phí vận chuyển Hộp quà tặng đến khách hàng.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Cuu-Hac-Dien-Nien-6banh_11082026141125.jpg?sign=D7quEmmoXFIIZjbJKCr4GQ',
        0,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        'c2093594-5041-43cc-8e7b-96715f7e8632',
        'Evoucher Hộp quà trung thu Cửu Hạc Diên Niên 2026 phiên bản Vali Popup 3D cao cấp - Combo 4 bánh và trà',
        'Hộp quà cao cấp với thiết kế vali Popup 3D ép kim vàng 9999 độc đáo.
Gồm 4 bánh trung thu thượng hạng và trà lài thượng hạng.
Khách hàng được lựa chọn 1 trong 2 combo bánh phù hợp với nhu cầu.
Đi kèm túi giấy Ivory, thiệp Trung Thu và bộ dao nĩa sang trọng.
Hình tượng Cửu Hạc mang ý nghĩa trường thọ, thịnh vượng và phát triển bền vững.
Hộp quà có thể tái sử dụng làm vật trang trí hoặc lưu trữ sau mùa Trung Thu.',
        699000.00,
        590000.00,
        'Khách hàng áp dụng: Tất cả khách hàng
Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 9:00 - 17:00
Số lượng E-Voucher áp dụng: Sử dụng 01 voucher/01 hộp quà. Không giới hạn số lượng voucher/ hóa đơn.
Thông tin cách mua hàng HƯỚNG DẪN ĐỔI VOUCHER
Bước 1. Khách hàng nhận voucher liên hệ GIVISTA để đổi hộp quà Trung Thu 2026
Hotline/Zalo: 0969117926
Facebook:
Tại đây
Bước 2. Cung cấp mã voucher để đổi hộp quà
Bước 3. Khách hàng thanh toán phí vận chuyển trực tiếp cho đơn vị vận chuyển
Lưu ý: Không hỗ trợ khách hàng đổi quà trực tiếp tại cửa hàng
Điều kiện khác
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Voucher chưa bao gồm phí vận chuyển Hộp quà tặng đến khách hàng.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Cuu-Hac-Dien-Nien-4banh_11082026140820.jpg?sign=yPS3yxhfNBC_VXg_wSXF0A',
        0,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        '2af5fa36-e992-4aa5-b774-c4c94150b6ad',
        'Evoucher Hộp quà trung thu Thanh Liên Thưởng Lãm I 2026 phiên bản hộp xếp 2 cánh cửa cao cấp - Combo 6 bánh',
        'Hộp quà gồm 6 bánh trung thu cao cấp với 2 lựa chọn combo phong phú.
Thiết kế hộp xếp 2 cánh cửa ép kim vàng 9999 sang trọng, kích thước 36 x 28 x 8 cm.
Lấy cảm hứng từ đầm sen và nghệ thuật sơn thủy, mang vẻ đẹp thanh lịch, tinh tế.
Khách hàng được lựa chọn Combo GVS 01 hoặc Combo GVS 02 theo nhu cầu.
Đi kèm túi giấy Ivory, thiệp Trung Thu và bộ dao nĩa cao cấp.
Phù hợp làm quà tặng đối tác, khách hàng, nhân viên và các chương trình tri ân doanh nghiệp.',
        839000.00,
        710000.00,
        'Khách hàng áp dụng: Tất cả khách hàng
Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 9:00 - 17:00
Số lượng E-Voucher áp dụng: Sử dụng 01 voucher/01 hộp quà. Không giới hạn số lượng voucher/ hóa đơn.
Thông tin cách mua hàng HƯỚNG DẪN ĐỔI VOUCHER
Bước 1. Khách hàng nhận voucher liên hệ GIVISTA để đổi hộp quà Trung Thu 2026
Hotline/Zalo: 0969117926
Facebook:
Tại đây
Bước 2. Cung cấp mã voucher để đổi hộp quà
Bước 3. Khách hàng thanh toán phí vận chuyển trực tiếp cho đơn vị vận chuyển
Lưu ý: Không hỗ trợ khách hàng đổi quà trực tiếp tại cửa hàng
Điều kiện khác
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Voucher chưa bao gồm phí vận chuyển Hộp quà tặng đến khách hàng.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Thanh-Lien-Thuong-Lam_11082026140441.jpg?sign=HBGZv2JnyAV5ZnrvqqnxiA',
        0,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        '56d560d5-f6bd-4eab-bdaa-054eee157faf',
        'Evoucher Hộp quà trung thu Hồng Cát Minh Nguyệt 2026 phiên bản hộp xếp 2 cánh cửa cao cấp - Combo 6 bánh',
        'Hộp quà gồm 6 bánh trung thu cao cấp với 2 lựa chọn combo đa dạng hương vị.
Thiết kế hộp xếp 2 cánh cửa ép kim vàng 9999 sang trọng, kích thước 36 x 28 x 8 cm.
Tông đỏ quyền quý kết hợp họa tiết Hằng Nga, Thỏ Ngọc và cây đa mang đậm bản sắc văn hóa Á Đông.
Khách hàng được lựa chọn giữa Combo GVS 01 hoặc Combo GVS 02 theo sở thích.
Đi kèm túi giấy Ivory, thiệp Trung Thu và bộ dao nĩa cao cấp.
Thích hợp làm quà tặng đối tác, khách hàng, nhân viên và các chương trình tri ân doanh nghiệp.',
        839000.00,
        710000.00,
        'Khách hàng áp dụng: Tất cả khách hàng
Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 9:00 - 17:00
Số lượng E-Voucher áp dụng: Sử dụng 01 voucher/01 hộp quà. Không giới hạn số lượng voucher/ hóa đơn.
Thông tin cách mua hàng HƯỚNG DẪN ĐỔI VOUCHER
Bước 1. Khách hàng nhận voucher liên hệ GIVISTA để đổi hộp quà Trung Thu 2026
Hotline/Zalo: 0969117926
Facebook:
Tại đây
Bước 2. Cung cấp mã voucher để đổi hộp quà
Bước 3. Khách hàng thanh toán phí vận chuyển trực tiếp cho đơn vị vận chuyển
Lưu ý: Không hỗ trợ khách hàng đổi quà trực tiếp tại cửa hàng
Điều kiện khác
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Voucher chưa bao gồm phí vận chuyển Hộp quà tặng đến khách hàng.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Hong-Cat-Minh-Nguyet_11082026140155.jpg?sign=SlG960eNtWhAx4BZjG3Rxw',
        0,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        '2caaf3e1-ef7d-44f1-9063-9e6f686fcc7a',
        'Evoucher Hộp quà trung thu Du Nhiên 2026 phiên bản nam châm cao cấp - Combo 4 bánh và trà',
        'Hộp quà gồm 4 bánh trung thu cao cấp kết hợp trà lài thượng hạng thanh tao.
Thiết kế hộp nam châm ép kim vàng 9999 với tông xanh ngọc trang nhã và hiện đại.
Lấy cảm hứng từ thiên nhiên, mang thông điệp bình an, cân bằng và phát triển bền vững.
Họa tiết hoa sen, chuồn chuồn và chú ếch xanh tạo nên vẻ đẹp gần gũi nhưng đầy nghệ thuật.
Bao gồm túi giấy Ivory, thiệp Trung Thu và bộ dao nĩa sang trọng.
Evoucher tiện lợi, dễ dàng đặt mua và gửi tặng nhanh chóng qua LifeLink.',
        569000.00,
        480000.00,
        'Khách hàng áp dụng: Tất cả khách hàng
Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 9:00 - 17:00
Số lượng E-Voucher áp dụng: Sử dụng 01 voucher/01 hộp quà. Không giới hạn số lượng voucher/ hóa đơn.
Thông tin cách mua hàng HƯỚNG DẪN ĐỔI VOUCHER
Bước 1. Khách hàng nhận voucher liên hệ GIVISTA để đổi hộp quà Trung Thu 2026
Hotline/Zalo: 0969117926
Facebook:
Tại đây
Bước 2. Cung cấp mã voucher để đổi hộp quà
Bước 3. Khách hàng thanh toán phí vận chuyển trực tiếp cho đơn vị vận chuyển
Lưu ý: Không hỗ trợ khách hàng đổi quà trực tiếp tại cửa hàng
Điều kiện khác
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Voucher chưa bao gồm phí vận chuyển Hộp quà tặng đến khách hàng.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/Evoucher-Du-Nhien-4-banh_07082026142410.jpg?sign=UvL30vO5ruYZxMktpzJKsQ',
        0,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        'c8eb736d-adfa-4559-881a-b85eb1641cd1',
        'Evoucher Hộp quà Trung Thu Viên Niên 2026 phiên bản nam châm cao cấp - Combo 4 bánh và trà',
        'Hộp quà gồm 4 bánh trung thu cao cấp kết hợp trà lài thượng hạng thanh tao.
Thiết kế hộp nam châm ép kim vàng 9999 với tông cam sang trọng và ấm áp.
Họa tiết hiện đại kết hợp biểu tượng truyền thống tạo nên vẻ đẹp tinh tế, khác biệt.
Thích hợp làm quà tặng đối tác, khách hàng, nhân viên và người thân dịp Trung Thu.
Đi kèm túi giấy Ivory, thiệp Trung Thu và bộ dao nĩa cao cấp.
Evoucher tiện lợi, dễ dàng đặt mua và gửi tặng nhanh chóng qua LifeLink.',
        569000.00,
        480000.00,
        'Khách hàng áp dụng: Tất cả khách hàng
Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 9:00 - 17:00
Số lượng E-Voucher áp dụng: Sử dụng 01 voucher/01 hộp quà. Không giới hạn số lượng voucher/ hóa đơn.
Thông tin cách mua hàng HƯỚNG DẪN ĐỔI VOUCHER
Bước 1. Khách hàng nhận voucher liên hệ GIVISTA để đổi hộp quà Trung Thu 2026
Hotline/Zalo: 0969117926
Facebook:
Tại đây
Bước 2. Cung cấp mã voucher để đổi hộp quà
Bước 3. Khách hàng thanh toán phí vận chuyển trực tiếp cho đơn vị vận chuyển
Lưu ý: Không hỗ trợ khách hàng đổi quà trực tiếp tại cửa hàng
Điều kiện khác
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Voucher chưa bao gồm phí vận chuyển Hộp quà tặng đến khách hàng.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Evoucher-Trung-Thu-Vien-Nien_07082026120056.jpg?sign=wOF5dHvY3S49HSF9Q_1ySA',
        0,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        'e2ccb81e-d3bf-4c04-a98c-c040a1bf8284',
        'Evoucher Hộp quà Trung Thu Đoàn Viên III 2026 phiên bản nam châm cao cấp - Combo 4 bánh và trà',
        'Hộp quà gồm 4 bánh trung thu cao cấp kết hợp trà lài thượng hạng thanh tao.
Thiết kế hộp nam châm ép kim vàng 9999 với gam xanh navy sang trọng, hiện đại.
Hình ảnh đêm hội trăng rằm được tái hiện tinh tế, đậm bản sắc văn hóa Việt.
Phù hợp làm quà tặng khách hàng, đối tác, nhân viên và các chương trình tri ân doanh nghiệp.
Đi kèm túi giấy Ivory, thiệp Trung Thu và bộ dao nĩa tiện lợi.
Evoucher tiện lợi, dễ dàng đặt mua và gửi tặng nhanh chóng qua LifeLink.',
        569000.00,
        480000.00,
        'Khách hàng áp dụng: Tất cả khách hàng
Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 9:00 - 17:00
Số lượng E-Voucher áp dụng: Sử dụng 01 voucher/01 hộp quà. Không giới hạn số lượng voucher/ hóa đơn.
Thông tin cách mua hàng HƯỚNG DẪN ĐỔI VOUCHER
Bước 1. Khách hàng nhận voucher liên hệ GIVISTA để đổi hộp quà Trung Thu 2026
Hotline/Zalo: 0969117926
Facebook:
Tại đây
Bước 2. Cung cấp mã voucher để đổi hộp quà
Bước 3. Khách hàng thanh toán phí vận chuyển trực tiếp cho đơn vị vận chuyển
Lưu ý: Không hỗ trợ khách hàng đổi quà trực tiếp tại cửa hàng
Điều kiện khác
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Voucher chưa bao gồm phí vận chuyển Hộp quà tặng đến khách hàng.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Trung-Thu-Doan-Vien-III_11082026111525.jpg?sign=X0nbEnTmt4vjPnp10vGwKQ',
        0,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        'd27959cb-1ef8-4767-bc56-84b751f00837',
        'Evoucher hộp quà Trung Thu Đoàn Viên I 2026 phiên bản nam châm cao cấp - Combo 4 bánh và trà',
        'Hộp quà gồm 4 bánh trung thu cao cấp kết hợp trà lài thượng hạng thanh tao.
Thiết kế hộp nam châm ép kim vàng 9999 sang trọng, tinh tế và bền đẹp.
Gam xanh dương hoàng gia nổi bật, tái hiện không gian đêm hội trăng rằm truyền thống.
Thích hợp làm quà tặng đối tác, khách hàng, nhân viên và người thân dịp Trung Thu.
Bao gồm đầy đủ túi giấy Ivory, thiệp Trung Thu và bộ dao nĩa tiện lợi.
Evoucher dễ dàng đặt mua và gửi tặng nhanh chóng trên LifeLink.',
        569000.00,
        480000.00,
        'Khách hàng áp dụng: Tất cả khách hàng
Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 9:00 - 17:00
Số lượng E-Voucher áp dụng: Sử dụng 01 voucher/01 hộp quà. Không giới hạn số lượng voucher/ hóa đơn.
Thông tin cách mua hàng HƯỚNG DẪN ĐỔI VOUCHER
Bước 1. Khách hàng nhận voucher liên hệ GIVISTA để đổi hộp quà Trung Thu 2026
Hotline/Zalo: 0969117926
Facebook:
Tại đây
Bước 2. Cung cấp mã voucher để đổi hộp quà
Bước 3. Khách hàng thanh toán phí vận chuyển trực tiếp cho đơn vị vận chuyển
Lưu ý: Không hỗ trợ khách hàng đổi quà trực tiếp tại cửa hàng
Điều kiện khác
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Voucher chưa bao gồm phí vận chuyển Hộp quà tặng đến khách hàng.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Trung-Thu-Doan-Vien-I_11082026111000.jpg?sign=E1EUnKUDC3VW6T8CldlXnQ',
        0,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        '095bb2c0-497a-48ff-9161-bc2e8598c43a',
        'Evoucher Hộp quà Trung Thu Đoàn Viên II 2026 phiên bản nam châm cao cấp - Combo 4 bánh và trà',
        'Hộp quà cao cấp gồm 4 bánh trung thu thượng hạng kết hợp trà lài thơm dịu.
Thiết kế hộp nam châm ép kim vàng 9999 sang trọng, tinh tế và đẳng cấp.
Lấy cảm hứng từ không khí đoàn viên truyền thống của đêm Trung Thu Việt Nam.
Phù hợp làm quà tặng khách hàng, đối tác, nhân viên và người thân.
Bao gồm đầy đủ túi giấy, thiệp Trung Thu và bộ dao nĩa tiện dụng.
Evoucher tiện lợi, dễ dàng đặt mua và gửi tặng ngay trên LifeLink.',
        569000.00,
        480000.00,
        'Khách hàng áp dụng: Tất cả khách hàng
Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 9:00 - 17:00
Số lượng E-Voucher áp dụng: Sử dụng 01 voucher/01 hộp quà. Không giới hạn số lượng voucher/ hóa đơn.
Thông tin cách mua hàng HƯỚNG DẪN ĐỔI VOUCHER
Bước 1. Khách hàng nhận voucher liên hệ GIVISTA để đổi hộp quà Trung Thu 2026
Hotline/Zalo: 0969117926
Facebook:
Tại đây
Bước 2. Cung cấp mã voucher để đổi hộp quà
Bước 3. Khách hàng thanh toán phí vận chuyển trực tiếp cho đơn vị vận chuyển
Lưu ý: Không hỗ trợ khách hàng đổi quà trực tiếp tại cửa hàng
Điều kiện khác
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Voucher chưa bao gồm phí vận chuyển Hộp quà tặng đến khách hàng.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Trung-Thu-Doan-Vien-II_11082026102902.jpg?sign=vfnpUSH6mGOBvIbYQmfaYw',
        0,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        '9171193c-e60a-4c4e-b06e-c1b4af574678',
        'Evoucher Hộp quà trung thu Hạc Vũ Triều Dương 2026 phiên bản nam châm cao cấp - Combo 4 bánh và trà',
        'Evoucher Hộp quà trung thu Hạc Vũ Triều Dương 2026 phiên bản nam châm cao cấp - Combo 4 bánh và trà là món quà Trung Thu cao cấp dành cho doanh nghiệp.
Thiết kế lấy cảm hứng từ chim hạc, rừng tùng và ánh dương, mang ý nghĩa thịnh vượng, trường tồn và phát triển.
Bao gồm 4 bánh Trung Thu cao cấp kết hợp trà lài thượng hạng, mang đến trải nghiệm thưởng thức trọn vẹn.
Hộp nam châm ép kim vàng 9999 cùng túi giấy Ivory tạo nên vẻ đẹp sang trọng, tinh tế.
Phù hợp làm quà tặng đối tác, khách hàng, nhân viên và người thân trong dịp Trung Thu.
Đặt Evoucher nhanh chóng, thuận tiện và an toàn trên LifeLink.',
        569000.00,
        480000.00,
        'Khách hàng áp dụng: Tất cả khách hàng
Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 9:00 - 17:00
Số lượng E-Voucher áp dụng: Sử dụng 01 voucher/01 hộp quà. Không giới hạn số lượng voucher/ hóa đơn.
Thông tin cách mua hàng HƯỚNG DẪN ĐỔI VOUCHER
Bước 1. Khách hàng nhận voucher liên hệ GIVISTA để đổi hộp quà Trung Thu 2026
Hotline/Zalo: 0969117926
Facebook:
Tại đây
Bước 2. Cung cấp mã voucher để đổi hộp quà
Bước 3. Khách hàng thanh toán phí vận chuyển trực tiếp cho đơn vị vận chuyển
Lưu ý: Không hỗ trợ khách hàng đổi quà trực tiếp tại cửa hàng
Điều kiện khác
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Voucher chưa bao gồm phí vận chuyển Hộp quà tặng đến khách hàng.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Hac-Vu-Trieu-Duong-4banh_11082026102609.jpg?sign=2RfRpKDMLaP8xCkVIJ58Pw',
        0,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        'ad44799d-889c-450d-bbbf-1271b3e321cc',
        'Evoucher - Hộp quà trung thu Moonlit Harmony 2026 phiên bản nam châm - Combo 4 bánh và trà',
        'Evoucher - Hộp quà trung thu Moonlit Harmony 2026 phiên bản nam châm - Combo 4 bánh và trà sở hữu thiết kế sang trọng, mang đậm dấu ấn nghệ thuật mùa trăng.
Tông màu đỏ rượu vang kết hợp ép kim vàng 9999 tạo nên vẻ đẹp nổi bật và đẳng cấp.
Bao gồm 4 bánh Trung Thu cao cấp cùng trà lài thượng hạng, mang đến trải nghiệm thưởng thức trọn vẹn.
Hộp quà nam châm chắc chắn, đi kèm túi giấy Ivory, thiệp Trung Thu và bộ dao nĩa tiện lợi.
Thích hợp làm quà tặng đối tác, khách hàng, nhân viên và người thân trong dịp Trung Thu.
Đặt Evoucher nhanh chóng và tiện lợi trên LifeLink.',
        569000.00,
        480000.00,
        'Khách hàng áp dụng: Tất cả khách hàng
Ngày áp dụng: Thứ 2 - Thứ 6
Giờ áp dụng: 9:00 - 17:00
Số lượng E-Voucher áp dụng: Sử dụng 01 voucher/01 hộp quà. Không giới hạn số lượng voucher/ hóa đơn.
Thông tin cách mua hàng HƯỚNG DẪN ĐỔI VOUCHER
Bước 1. Khách hàng nhận voucher liên hệ GIVISTA để đổi hộp quà Trung Thu 2026
Hotline/Zalo: 0969117926
Facebook:
Tại đây
Bước 2. Cung cấp mã voucher để đổi hộp quà
Bước 3. Khách hàng thanh toán phí vận chuyển trực tiếp cho đơn vị vận chuyển
Lưu ý: Không hỗ trợ khách hàng đổi quà trực tiếp tại cửa hàng
Điều kiện khác
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Voucher chưa bao gồm phí vận chuyển Hộp quà tặng đến khách hàng.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-Moonlit-Harmony-4banh_11082026101508.jpg?sign=-gN17MPFZfnwx7p-_PfCHg',
        0,
        '40000000-0000-0000-0000-000000000001'
    ),
    (
        'e0a5a387-4eca-495d-bc18-60e357927889',
        'E-Coupon - Giảm 10% điều trị chuyên sâu đái tháo đường tại DiaB',
        'E-Coupon - Giảm 10% điều trị chuyên sâu đái tháo đường tại DiaB giúp bạn tiết kiệm chi phí khi sử dụng dịch vụ điều trị chuyên sâu.
Chương trình được xây dựng theo mô hình điều trị cá nhân hóa, phù hợp với từng người bệnh.
Được trực tiếp thăm khám và theo dõi bởi đội ngũ bác sĩ nội tiết, chuyển hóa giàu kinh nghiệm.
Hỗ trợ kiểm soát đường huyết, hạn chế biến chứng và nâng cao chất lượng cuộc sống.
Kết hợp điều trị y khoa với tư vấn thay đổi lối sống để đạt hiệu quả bền vững.
Đặt voucher nhanh chóng, thuận tiện và an toàn trên LifeLink.',
        1000000.00,
        9000.00,
        'Khách hàng áp dụng: Tất cả khách hàng
Ngày áp dụng: Tất các các ngày
Giờ áp dụng: 08h00 - 18h00
Số lượng E-Voucher áp dụng: Mỗi tài khoản/khách hàng chỉ được đổi và sử dụng Phiếu ưu đãi 01 lần.
Hướng dẫn đặt dịch vụ:
Cách 1: Đặt lịch: Khách hàng vui lòng gọi Hotline hoặc nhắn tin zalo: 0903 027 308 và đọc mã code để DiaB ghi nhận, đối soát.
Cách 2: Check-in: Khách hàng xuất trình mã ưu đãi tại phòng khám để được xác nhận và trải nghiệm dịch vụ.
Điều kiện khác
Mỗi Phiếu ưu đãi chỉ có giá trị sử dụng 01 lần và không có giá trị quy đổi thành tiền mặt.
Không áp dụng đồng thời với các chương trình khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/Voucher-10--dieu-tri-dai-thao-duong_04082026103220.png?sign=_a7kdkWRnQ9v8T3TVWyHUA',
        0,
        '40000000-0000-0000-0000-000000000002'
    ),
    (
        'f2e93a85-4768-4c13-9169-7f123120a523',
        'E-Coupon - Giảm 10% chương trình Giảm cân chuẩn y khoa tại DiaB',
        'E-Coupon - Giảm 10% chương trình Giảm cân chuẩn y khoa tại DiaB giúp bạn tiết kiệm chi phí khi tham gia chương trình giảm cân chuyên sâu.
Chương trình kết hợp khám chuyên khoa, xét nghiệm và xây dựng lộ trình giảm cân cá nhân hóa.
Ứng dụng mô hình quản lý cân nặng chuẩn y khoa dành riêng cho từng người bệnh.
Hỗ trợ cải thiện cân nặng, giảm mỡ nội tạng và các chỉ số chuyển hóa.
Đồng hành lâu dài để duy trì vóc dáng và xây dựng lối sống lành mạnh.
Đặt voucher nhanh chóng và thuận tiện trên nền tảng LifeLink.',
        850000.00,
        9000.00,
        'Khách hàng áp dụng: Tất cả khách hàng
Ngày áp dụng: Tất các các ngày
Giờ áp dụng: 08h00 - 18h00
Số lượng E-Voucher áp dụng: Mỗi tài khoản/khách hàng chỉ được đổi và sử dụng Phiếu ưu đãi 01 lần.
Hướng dẫn đặt dịch vụ:
Cách 1: Đặt lịch: Khách hàng vui lòng gọi Hotline hoặc nhắn tin zalo: 0903 027 308 và đọc mã code để DiaB ghi nhận, đối soát.
Cách 2: Check-in: Khách hàng xuất trình mã ưu đãi tại phòng khám để được xác nhận và trải nghiệm dịch vụ.
Điều kiện khác
Mỗi Phiếu ưu đãi chỉ có giá trị sử dụng 01 lần và không có giá trị quy đổi thành tiền mặt.
Không áp dụng đồng thời với các chương trình khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/Voucher-10--chuong-trinh-giam-can_04082026100149.png?sign=XdNb45loJco_xaeAa9XcHA',
        0,
        '40000000-0000-0000-0000-000000000002'
    ),
    (
        'f002fd97-623e-470e-81a2-ac78e7e36d08',
        'E-Coupon - Miễn phí khám và tư vấn chuyên sâu tại DiaB',
        'E-Coupon - Miễn phí khám và tư vấn chuyên sâu tại DiaB giúp bạn tiếp cận dịch vụ khám chuyên khoa chất lượng hoàn toàn miễn phí.
Được tư vấn bởi đội ngũ bác sĩ chuyên sâu về đái tháo đường, béo phì và các bệnh lý chuyển hóa.
Hỗ trợ đánh giá sức khỏe toàn diện và xây dựng kế hoạch điều trị phù hợp với từng cá nhân.
Áp dụng mô hình quản lý sức khỏe chuẩn y khoa, cá thể hóa theo từng người bệnh.
Đồng hành giúp kiểm soát bệnh lý chuyển hóa và xây dựng lối sống lành mạnh.
Đặt lịch nhanh chóng và thuận tiện thông qua LifeLink.',
        350000.00,
        9000.00,
        'Khách hàng áp dụng: Tất cả khách hàng
Ngày áp dụng: Tất các các ngày
Giờ áp dụng: 08h00 - 18h00
Số lượng E-Voucher áp dụng: Mỗi tài khoản/khách hàng chỉ được đổi và sử dụng Phiếu ưu đãi 01 lần.
Hướng dẫn đặt dịch vụ:
Cách 1: Đặt lịch: Khách hàng vui lòng gọi Hotline hoặc nhắn tin zalo: 0903 027 308 và đọc mã code để DiaB ghi nhận, đối soát.
Cách 2: Check-in: Khách hàng xuất trình mã ưu đãi tại phòng khám để được xác nhận và trải nghiệm dịch vụ.
Điều kiện khác
Mỗi Phiếu ưu đãi chỉ có giá trị sử dụng 01 lần và không có giá trị quy đổi thành tiền mặt.
Không áp dụng đồng thời với các chương trình khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/Voucher-mien-phi-kham_04082026091222.png?sign=sEbiRhkn4QFev_MWIB4hpw',
        0,
        '40000000-0000-0000-0000-000000000002'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - E-Coupon ưu đãi trải nghiệm dịch vụ Triệt lông nách hoặc bikini',
        'Liệu trình triệt lông nách giúp giảm thâm, cho vùng da dưới cánh tay sáng mịn, đều màu và tự tin hơn mỗi ngày.
Tiến trình cá nhân hóa từng bước, kết hợp kiểm tra da và sử dụng ánh sáng quang đa tầng nhẹ nhàng, phù hợp với khách hàng.
Áp dụng công nghệ New E-light hiện đại, tác động sâu vào nang lông mà không gây xâm lấn, hạn chế đau rát hay kích ứng.
Không gian thẩm mỹ viện khang trang, hiện đại, tạo cảm giác thư thái, riêng tư cho khách hàng khi trải nghiệm dịch vụ.
Đội ngũ chuyên gia giàu kinh nghiệm, luôn đồng hành và tư vấn tận tình để đảm bảo hiệu quả an toàn nhất cho khách hàng.
Chuyên viên đạt chứng chỉ hành nghề, am hiểu công nghệ, mang lại kết quả tối ưu, an tâm khi sử dụng dịch vụ tại Ngọc Dung.
Sản phẩm và máy móc đều đến từ đơn vị uy tín, kiểm soát chất lượng nghiêm ngặt trước khi phục vụ khách hàng.
Đặt dịch vụ qua LifeLink nhận ưu đãi hấp dẫn, giữ chỗ nhanh, e-voucher dễ dùng và linh hoạt chọn thời gian phù hợp.',
        350000.00,
        9000.00,
        'E-Coupon ưu đãi trải nghiệm dịch vụ Triệt lông nách/bikini tại Hệ thống Thẩm mỹ viện Ngọc Dung
Khách hàng áp dụng:
Nữ trên 22 tuổi (quốc tịch Việt Nam)
Áp dụng cho khách hàng lần đầu tiên sử dụng dịch vụ tại hệ thống Thẩm mỹ viện Ngọc Dung
Không áp dụng cho phụ nữ đang mang thai và trên 25 tuổi
Số lượng sử dụng:
Mỗi khách hàng chỉ được sử dụng 01 voucher/01 lần sử dụng
Mỗi khách hàng được mua tối đa 02 E-Voucher/E-Coupon trong số các dịch vụ ưu đãi tại LifeLink
Phạm vi sử dụng:
Ngày áp dụng: Thứ hai - Chủ nhật (trừ các ngày Lễ, Tết, bù Lễ theo lịch nhà nước)
Giờ áp dụng: 9h00 - 19h00
Thời hạn sử dụng sau khi kích hoạt: 15 ngày
Lưu ý:
Quý khách phải kích hoạt mã ưu đãi ít nhất 60 phút trước khi đến để được phục vụ tốt nhất.
Vui lòng liên hệ đặt lịch tối thiểu 24 tiếng trước khi đến. Hệ thống không nhận khách đến trực tiếp chưa đăng ký trước.
Thông tin liên hệ:
Hotline: *3232 hoặc 1800 6377
Zalo: 0902 641 922
Kích hoạt mã:
Tại đây
Điều kiện bắt buộc:
Không áp dụng đồng thời với các chương trình khuyến mãi khác
Mỗi khách hàng chỉ được dùng một mã ưu đãi cho mỗi chương trình khuyến mãi trong suốt thời gian diễn ra chương trình
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-tri-long-nach_27052026114449.jpg?sign=9tDS7WAVy8ZdGuvbwIwweQ',
        0,
        '40000000-0000-0000-0000-000000000002'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - E-Coupon Trải nghiệm điều trị sẹo rỗ Laser Fractional CO2',
        'Liệu trình giúp làm đầy sẹo rỗ, cải thiện kết cấu và màu sắc da, trả lại làn da mịn màng tự nhiên.
Chuỗi chăm sóc gồm giải phóng chân sẹo, kích thích tăng sinh collagen, mài mòn bờ sẹo và phục hồi da nhẹ nhàng.
Ứng dụng công nghệ laser fractional chuyên sâu, lựa chọn từ các đơn vị uy tín, đảm bảo hiệu quả và an toàn cho da.
Không gian hiện đại, trang thiết bị đạt chuẩn kỹ thuật, mang tới trải nghiệm thư giãn và riêng tư cho khách hàng.
Đội ngũ chuyên gia nhiều năm kinh nghiệm trong lĩnh vực thẩm mỹ, am hiểu các giải pháp chăm sóc và phục hồi da tối ưu.
Chuyên viên có bằng cấp chính quy, chứng chỉ hành nghề, luôn cẩn trọng trong từng khâu thực hiện liệu trình.
Đặt lịch dễ dàng trên Dealtoday, nhận ưu đãi lớn, đảm bảo an tâm với nền tảng uy tín kèm nhiều tiện ích hấp dẫn.
Nhanh tay săn deal để trải nghiệm dịch vụ chất lượng và tiết kiệm chi phí chăm sóc làn da ngay hôm nay tại Ngọc Dung.',
        350000.00,
        9000.00,
        'E-Coupon Trải nghiệm điều trị sẹo rỗ Laser Fractional CO2 tại Hệ thống Thẩm mỹ viện Ngọc Dung
Khách hàng áp dụng:
Nữ trên 22 tuổi, quốc tịch Việt Nam.
Chỉ áp dụng cho khách hàng lần đầu tiên sử dụng dịch vụ tại Hệ thống Thẩm mỹ viện Ngọc Dung.
Không áp dụng cho phụ nữ đang mang thai hoặc trên 25 tuổi.
Số lượng sử dụng:
01 voucher/khách/lần sử dụng.
Mỗi khách hàng được mua tối đa 2 E-Voucher/E-Coupon trong tất cả các dịch vụ ưu đãi tại LifeLink.
Mỗi chương trình khuyến mãi chỉ dùng được 1 mã ưu đãi/khách trong suốt thời gian diễn ra chương trình.
Phạm vi sử dụng:
Áp dụng từ Thứ hai đến Chủ nhật (trừ các ngày Lễ, Tết, bù Lễ theo lịch nghỉ nhà nước).
Giờ phục vụ: 9h00 - 19h00.
Thời hạn sử dụng sau khi kích hoạt: 15 ngày.
Lưu ý:
Quý khách phải kích hoạt mã ưu đãi ít nhất 60 phút trước khi đến để được phục vụ tốt nhất:
Tại đây
Vui lòng đặt lịch qua hotline hoặc đăng ký trước ít nhất 24 tiếng để đảm bảo được phục vụ tốt nhất.
Hệ thống không nhận khách hàng đến trực tiếp nếu chưa đăng ký đặt chỗ trước.
Thông tin liên hệ:
Hotline hỗ trợ: *3232 hoặc 1800 6377.
Zalo hỗ trợ: 0902 641 922.
Điều kiện khác:
Không có giá trị quy đổi thành tiền mặt, không hoàn lại tiền thừa.
Không áp dụng đồng thời với các chương trình khuyến mãi khác.
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-tri-seo-ro_27052026114318.jpg?sign=pF864ZeFzTvuDHw-Wfvdvg',
        0,
        '40000000-0000-0000-0000-000000000002'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - E-Coupon ưu đãi Xóa nhăn Super Hifu một trong các vùng mắt, cằm, cổ, tay',
        'Liệu trình giúp xóa mờ 90% nếp nhăn, giảm bọng mỡ, mang lại vùng mắt tươi trẻ rạng rỡ.
Khách hàng sẽ trải nghiệm cảm giác thư giãn nhẹ nhàng, chăm sóc chuyên sâu cho vùng mắt nhạy cảm.
Ứng dụng công nghệ Super Hifu được các chuyên gia thẩm mỹ hàng đầu thế giới công nhận độ an toàn.
Không gian Thẩm mỹ viện Ngọc Dung hiện đại, ấm áp, tạo cảm giác thư thái cho khách hàng.
Đội ngũ chuyên viên giàu kinh nghiệm, nhẹ nhàng và tận tâm trong từng khâu chăm sóc khách hàng.
Tất cả kỹ thuật viên đều được đào tạo bài bản, sở hữu chứng chỉ hành nghề và hiểu rõ về công nghệ làm đẹp.
Khi đặt qua LifeLink, khách hàng được nhận ưu đãi hấp dẫn và quy trình đặt lịch cực nhanh, tiện lợi.
Đặt lịch ngay hôm nay trên LifeLink để tận hưởng dịch vụ chất lượng, giá tốt, cân bằng sắc đẹp và thư giãn vượt trội.',
        350000.00,
        9000.00,
        'E-Coupon ưu đãi Xóa nhăn Super Hifu vùng mắt/cằm/cổ/tay tại Hệ thống Thẩm mỹ viện Ngọc Dung
Khách hàng áp dụng:
Nữ trên 22 tuổi (quốc tịch Việt Nam)
Áp dụng cho khách hàng lần đầu tiên sử dụng dịch vụ tại hệ thống Thẩm mỹ viện Ngọc Dung
Không áp dụng cho phụ nữ đang mang thai và trên 25 tuổi
Số lượng sử dụng:
Mỗi khách hàng chỉ được sử dụng 01 voucher/01 lần sử dụng
Mỗi khách hàng được mua tối đa 02 E-Voucher/E-Coupon trong số các dịch vụ ưu đãi tại LifeLink
Phạm vi sử dụng:
Ngày áp dụng: Thứ hai - Chủ nhật (trừ các ngày Lễ, Tết, bù Lễ theo lịch nhà nước)
Giờ áp dụng: 9h00 - 19h00
Thời hạn sử dụng sau khi kích hoạt: 15 ngày
Lưu ý:
Quý khách phải kích hoạt mã ưu đãi ít nhất 60 phút trước khi đến để được phục vụ tốt nhất.
Vui lòng liên hệ đặt lịch tối thiểu 24 tiếng trước khi đến. Hệ thống không nhận khách đến trực tiếp chưa đăng ký trước. Mong quý khách thông cảm.
Thông tin liên hệ:
Hotline: *3232 hoặc 1800 6377
Zalo: 0902 641 922
Kích hoạt mã:
Tại đây
Điều kiện bắt buộc:
Không áp dụng đồng thời với các chương trình khuyến mãi khác
Mỗi khách hàng chỉ được dùng một mã ưu đãi cho mỗi chương trình khuyến mãi trong suốt thời gian diễn ra chương trình
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-TMV-Ngoc-Dung-3_27052026142732.jpg?sign=IUjFK3_OvLuHMdnxdrvmGQ',
        0,
        '40000000-0000-0000-0000-000000000002'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - E-Coupon trải nghiệm Điều trị lỗ chân lông bằng Laser',
        'Liệu trình hỗ trợ loại bỏ vi khuẩn, giảm viêm, cho làn da sáng mịn và đều màu hơn sau mỗi lần chăm sóc.
Toàn bộ quy trình sử dụng năng lượng phù hợp, giúp làm sạch bã nhờn, loại bỏ lông mọc ngược, nâng cao sức khỏe làn da.
Ứng dụng công nghệ Laser với kỹ thuật tinh chỉnh theo từng tình trạng da, đảm bảo hiệu quả và an toàn tối ưu cho khách hàng.
Hệ thống máy móc được lựa chọn từ các nhà cung cấp uy tín, kiểm tra kỹ càng nhằm đảm bảo quá trình làm đẹp an toàn, hoạt động ổn định.
Đội ngũ chuyên gia giàu kinh nghiệm, tận tâm và luôn sẵn sàng tư vấn hỗ trợ khách hàng trong suốt liệu trình.
Tất cả chuyên viên, kỹ thuật viên đều được đào tạo bài bản, sở hữu chứng chỉ hành nghề, mang lại sự an tâm tuyệt đối khi sử dụng dịch vụ.
Khách hàng tận hưởng nét khác biệt nhờ quy trình chăm sóc chuyên nghiệp và sự minh bạch, dễ hiểu ở từng bước thực hiện của Thẩm mỹ viện Ngọc Dung.
Đặt dịch vụ qua LifeLink nhận giá ưu đãi, bảo đảm quyền lợi, chủ động chọn lịch, trải nghiệm e-voucher tiện nghi và hỗ trợ đặt lịch nhanh chóng.',
        350000.00,
        9000.00,
        'E-Coupon trải nghiệm Điều trị lỗ chân lông bằng Laser tại Hệ thống Thẩm mỹ viện Ngọc Dung
Khách hàng áp dụng:
Nữ trên 22 tuổi, quốc tịch Việt Nam.
Chỉ áp dụng cho khách hàng lần đầu tiên sử dụng dịch vụ tại Ngọc Dung.
Số lượng sử dụng:
Mỗi khách hàng được dùng một mã ưu đãi cho mỗi chương trình khuyến mãi trong suốt thời gian diễn ra chương trình.
Mỗi khách hàng được mua tối đa 02 E-Voucher/E-Coupon trong số các dịch vụ ưu đãi của hệ thống Thẩm mỹ viện Ngọc Dung đang có tại LifeLink.
01 voucher/01 khách/01 lần sử dụng.
Phạm vi sử dụng:
Ngày áp dụng: Thứ hai - Chủ nhật (Trừ các ngày Lễ, Tết, Bù Lễ theo lịch nghỉ của nhà nước).
Giờ áp dụng: 9h00 - 19h00.
Thời hạn sử dụng sau khi kích hoạt: 15 ngày.
Lưu ý:
Quý khách hàng vui lòng liên hệ đặt chỗ trước tối thiểu 24 tiếng để được phục vụ tốt nhất. Hệ Thống Thẩm mỹ viện Ngọc Dung không nhận khách hàng đến trực tiếp nếu chưa đăng ký đặt chỗ trước. Mong quý khách thông cảm.
Hệ thống Thẩm mỹ viện Ngọc Dung không nhận khách hàng đến trực tiếp nếu chưa đăng ký đặt chỗ trước.
Không áp dụng cho phụ nữ đang mang thai và trên 25 tuổi.
Quý khách phải kích hoạt mã ưu đãi ít nhất 60 phút trước khi đến để được phục vụ tốt nhất:
Tại đây
Thông tin liên hệ:
Hotline: *3232 hoặc 1800 6377.
Zalo: 0902 641 922.
Điều kiện bắt buộc:
Không có giá trị quy đổi thành tiền mặt và hoàn lại tiền thừa.
Không áp dụng đồng thời với các chương trình khuyến mãi khác.
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-tri-viem-nang-long_27052026112229.jpg?sign=tqqpS91KSbavhl51EgqgoA',
        0,
        '40000000-0000-0000-0000-000000000002'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - E-Coupon ưu đãi Chăm sóc dưỡng trẻ hóa da PL',
        'Liệu trình giúp trẻ hóa da, tăng sinh collagen tự nhiên, nâng cơ, làm mờ nếp nhăn và cải thiện sắc tố hiệu quả toàn diện.
Quy trình nhẹ nhàng, kết hợp công nghệ cao và thẩm mỹ nội khoa, mang lại cảm giác thư giãn xuyên suốt từng bước.
Áp dụng các công nghệ hiện đại đã được kiểm định chất lượng, an toàn, phù hợp với từng làn da và mục đích sử dụng.
Không gian spa sang trọng, ấm áp, đảm bảo riêng tư, giúp khách hàng cảm nhận trọn vẹn sự tinh tế và thư giãn.
Sở hữu đội ngũ chuyên gia giàu kinh nghiệm, đào tạo bài bản, am hiểu chuyên sâu về công nghệ làm đẹp hiện đại.
Tất cả chuyên viên đều có chứng chỉ hành nghề, đảm bảo các tiêu chuẩn an toàn và chất lượng dịch vụ vượt trội.
Ưu đãi hấp dẫn khi đặt lịch qua LifeLink, đi kèm quy trình hỗ trợ đặt hẹn linh hoạt, nhanh chóng và tiện lợi.
Đặt dịch vụ trên LifeLink, tận hưởng trải nghiệm làm đẹp tại Thẩm mỹ viện Ngọc Dung với mức giá ưu đãi nhất thị trường.',
        350000.00,
        9000.00,
        'E-Coupon ưu đãi Chăm sóc dưỡng trẻ hóa da PL (Ultra White) mặt/cổ/tay/mông tại Hệ thống Thẩm mỹ viện Ngọc Dung
Khách hàng áp dụng:
Nữ, quốc tịch Việt Nam, trên 22 tuổi.
Áp dụng cho khách hàng lần đầu tiên sử dụng dịch vụ tại Ngọc Dung.
Không áp dụng cho phụ nữ đang mang thai và trên 25 tuổi.
Số lượng E-voucher áp dụng:
Mỗi khách hàng chỉ được sử dụng 01 voucher cho mỗi lần và mỗi chương trình khuyến mãi.
Mỗi khách hàng được mua tối đa 02 E-Voucher/E-Coupon trong số các dịch vụ ưu đãi của Hệ Thống Thẩm mỹ viện Ngọc Dung tại LifeLink.
Phạm vi sử dụng:
Ngày áp dụng: Thứ hai - Chủ nhật (trừ các ngày Lễ, Tết, Bù Lễ theo lịch nghỉ của nhà nước).
Giờ áp dụng: 9h00 - 19h00.
Thời hạn sử dụng sau khi kích hoạt: 15 ngày.
01 voucher/01 khách/01 lần sử dụng.
Lưu ý:
Quý khách cần kích hoạt mã ưu đãi ít nhất 60 phút trước khi đến để được phục vụ tốt nhất.
Vui lòng liên hệ đặt lịch trước khi đến tối thiểu 24 tiếng qua Hotline hoặc Zalo để đảm bảo được phục vụ.
Hệ thống Thẩm mỹ viện Ngọc Dung không nhận khách hàng đến trực tiếp nếu chưa đăng ký đặt chỗ trước.
Thông tin liên hệ:
Hotline: *3232 hoặc 1800 6377
Zalo hỗ trợ: 0902 641 922
Kích hoạt mã ưu đãi:
Tại đây
Điều kiện khác:
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với các chương trình khuyến mãi khác.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-TMV-Ngoc-Dung-2_27052026142724.jpg?sign=bqiGHg9B-tDthJw4iTjzGg',
        0,
        '40000000-0000-0000-0000-000000000002'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        'Hệ thống Thẩm mỹ viện Ngọc Dung - E-Coupon ưu đãi trải nghiệm dịch vụ Công nghê Căng trắng da điện di nano',
        'Liệu trình giúp da trắng sáng, căng bóng, se khít lỗ chân lông và làm mờ nếp nhăn rõ rệt.
Khách hàng sẽ được trải nghiệm dịch vụ chăm sóc da thư giãn, kết hợp công nghệ dưỡng trắng nano và điện di.
Căng trắng da điện di Nano sử dụng tinh chất dưỡng trắng dạng nano kết hợp với dòng điện di an toàn.
Nằm trong không gian spa hiện đại, nhẹ nhàng, tạo cảm giác thư giãn tuyệt đối cho khách hàng.
Đội ngũ chuyên gia, kỹ thuật viên giàu kinh nghiệm, được đào tạo bài bản, am hiểu công nghệ làm đẹp tiên tiến.
Các chuyên gia tại Thẩm mỹ viện Ngọc Dung đều có chứng chỉ hành nghề, đảm bảo an toàn cho mỗi khách hàng sử dụng dịch vụ.
Sản phẩm và máy móc đều được kiểm tra kỹ lưỡng, nguồn gốc rõ ràng trước khi áp dụng phục vụ khách hàng.
Ưu đãi hấp dẫn khi đặt dịch vụ qua LifeLink, hỗ trợ đặt lịch nhanh chóng, tiết kiệm chi phí tối đa.',
        350000.00,
        9000.00,
        'Khách hàng áp dụng:
Nữ trên 22 tuổi, quốc tịch Việt Nam
Chỉ áp dụng cho khách hàng lần đầu tiên sử dụng dịch vụ tại Ngọc Dung
Không áp dụng cho phụ nữ đang mang thai và trên 25 tuổi
Số lượng E-Voucher áp dụng:
Mỗi khách hàng chỉ được dùng một mã ưu đãi cho mỗi chương trình khuyến mãi trong suốt thời gian diễn ra chương trình
Mỗi khách hàng được mua tối đa 02 E-Voucher/E-Coupon trong số các dịch vụ ưu đãi đang có tại hệ thống
01 voucher/01 khách/01 lần sử dụng
Phạm vi sử dụng:
Ngày áp dụng: Thứ hai - Chủ nhật (Trừ các ngày Lễ, Tết, Bù Lễ theo lịch nghỉ của nhà nước)
Giờ áp dụng: 9h00 - 19h00
Thời hạn sử dụng sau khi kích hoạt: 15 ngày
Lưu ý:
Quý khách cần kích hoạt mã ưu đãi ít nhất 60 phút trước khi đến để được phục vụ tốt nhất
Vui lòng liên hệ hotline hoặc đăng ký đặt chỗ trước khi đến tối thiểu 24 tiếng để đảm bảo phục vụ chu đáo. Hệ thống không nhận khách đến trực tiếp nếu chưa đăng ký trước
Thông tin liên hệ:
Hotline: *3232 hoặc 1800 6377
Zalo: 0902 641 922
Kênh kích hoạt ưu đãi:
Tại đây
Điều kiện khác:
Không có giá trị quy đổi thành tiền mặt và hoàn lại tiền thừa
Không áp dụng đồng thời với các chương trình khuyến mãi khác
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-TMV-Ngoc-Dung-1_27052026142721.jpg?sign=kF7mR8MZomN_Dml8rHMXNw',
        0,
        '40000000-0000-0000-0000-000000000002'
    ),
    (
        'bd418cfc-c580-4c98-889e-505c17d8e758',
        'Sen 20 Hàng Tre và 72B Trần Hưng Đạo - Gói trị liệu cơ bản VIP 105 phút',
        'Liệu trình kết hợp thủy trị liệu truyền thống và trị liệu toàn thân, giúp thư giãn sâu, giảm căng thẳng, hồi phục sức khỏe hiệu quả.
Combo 105 phút gồm: ngâm bồn thảo dược, xông hơi Dao đỏ, đá muối Himalaya, trị liệu ngải cứu, mặt nạ ngũ hoa, bữa thực dưỡng.
Dược liệu Dao đỏ & thảo dược truyền thống được lựa chọn kỹ càng, đảm bảo nguồn gốc tự nhiên, phù hợp dưỡng sinh cổ truyền.
Không gian yên bình, đậm chất Hà Nội xưa giữa lòng phố cổ, phòng VIP riêng biệt tạo cảm giác riêng tư và thư giãn tuyệt đối.
Đội ngũ trị liệu viên tay nghề cao, kinh nghiệm 15–20 năm, được đào tạo bài bản từ Bệnh viện Châm cứu Trung ương.
Liệu trình phát triển bởi liên kết Viện Nghiên cứu & Chăm sóc sức khỏe Cổ truyền Việt Nam, đảm bảo chuyên môn và chất lượng chuyên sâu.',
        702000.00,
        600000.00,
        'Khách hàng áp dụng:
Nam, Nữ.
Phòng dịch vụ:
Phòng VIP riêng.
Số lượng
E-Voucher áp dụng:
Không giới hạn số lượng voucher áp dụng cho 01 khách.
Sử dụng 01 voucher/ 01 khách/ 01 lần sử dụng.
Thời gian áp dụng:
Áp dụng từ Thứ 2 đến Chủ nhật (trừ các ngày Lễ, Tết).
Khung giờ: 09h30 - 22h30.
Lưu ý:
Khách hàng vui lòng đặt chỗ trước khi đến để được phục vụ tốt nhất.
Khách hàng vui lòng liên hệ trước khi qua Spa.
Phụ thu:
Tiền TIP tối thiểu từ 100.000 vnđ/1 người.
Thông tin liên hệ:
Địa chỉ: 72B phố Trần Hưng Đạo, phường Trần Hưng Đạo, Quận Hoàn Kiếm, TP Hà Nội - Hotline: 0243.63.73.999 / 077 2760863
Địa chỉ: Số 20 Hàng Tre, Quận Hoàn Kiếm, TP Hà Nội - Hotline: 024 39879797 / 085 7879797
Điều kiện bắt buộc:
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác.
Giá đã bao gồm VAT.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/Sen-Tai-Thu-08_11052026115324.jpg?sign=jj-_wqq63urPgoB4hh8m9Q',
        0,
        '40000000-0000-0000-0000-000000000002'
    ),
    (
        'c0d2a396-75cf-43a7-92c8-e7183b9bf0c8',
        'Sen 20 Hàng Tre và 72B Trần Hưng Đạo - Gói trị liệu chuyên sâu VIP 120 phút',
        'Liệu trình giúp thư giãn sâu, phục hồi năng lượng, giảm stress và đem lại cảm giác cân bằng cho cơ thể.
120 phút trải nghiệm kết hợp thủy trị liệu, xông hơi thảo dược, xông khô đá muối, ngâm bể lạnh, trị liệu body với ngải cứu tươi và mặt nạ ngũ hoa.
Sử dụng các thảo dược tự nhiên, ngải cứu tươi, mặt nạ ngũ hoa, đá muối Himalaya, đảm bảo nguồn gốc truyền thống an toàn cho sức khỏe.
Không gian spa yên tĩnh, mang đậm dấu ấn văn hóa Hà Nội cổ, phòng VIP riêng tư tạo cảm giác thư thái tối đa.
Đội ngũ trị liệu viên kinh nghiệm 15–20 năm, am hiểu chuyên sâu về y học cổ truyền, nhẹ nhàng và tận tâm phục vụ từng khách hàng.
Trị liệu viên được đào tạo bài bản, có chứng chỉ từ Bệnh viện Châm cứu Trung ương, bảo chứng chất lượng dịch vụ.',
        756000.00,
        646000.00,
        'Khách hàng áp dụng:
Nam, Nữ.
Phòng dịch vụ:
Phòng VIP riêng.
Số lượng
E-Voucher áp dụng:
Không giới hạn số lượng voucher áp dụng cho 01 khách.
Sử dụng 01 voucher/ 01 khách/ 01 lần sử dụng.
Thời gian áp dụng:
Áp dụng từ Thứ 2 đến Chủ nhật (trừ các ngày Lễ, Tết).
Khung giờ: 09h30 - 22h30.
Lưu ý:
Khách hàng vui lòng đặt chỗ trước khi đến để được phục vụ tốt nhất.
Khách hàng vui lòng liên hệ trước khi qua Spa.
Phụ thu:
Tiền TIP tối thiểu từ 100.000 vnđ/1 người.
Thông tin liên hệ:
Địa chỉ: 72B phố Trần Hưng Đạo, phường Trần Hưng Đạo, Quận Hoàn Kiếm, TP Hà Nội - Hotline: 0243.63.73.999 / 077 2760863
Địa chỉ: Số 20 Hàng Tre, Quận Hoàn Kiếm, TP Hà Nội - Hotline: 024 39879797 / 085 7879797
Điều kiện bắt buộc:
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mãi khác.
Giá đã bao gồm VAT.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/Sen-Tai-Thu-09_11052026115230.jpg?sign=o1kuX2aLnX7D_AI774KZBA',
        0,
        '40000000-0000-0000-0000-000000000002'
    ),
    (
        '59661f1c-a32d-4d4e-94d4-c59d128d7e1d',
        'Sen 20 Hàng Tre và 72B Trần Hưng Đạo - Gói trị liệu cao cấp VIP 150 phút',
        'Trải nghiệm hành trình chăm sóc sức khỏe toàn thân kết hợp thủy trị liệu, massage và thực dưỡng theo phong cách y học cổ truyền Việt Nam.
Liệu trình gồm các bước thư giãn: ngâm bồn thảo dược Onsen, xông hơi đá muối Himalaya, massage toàn thân, chườm ngải cứu, đắp mặt nạ ngũ hoa và thực dưỡng nhẹ nhàng.
Tất cả sản phẩm sử dụng trong liệu trình đều có nguồn gốc thảo dược thiên nhiên, chú trọng an toàn và nâng cao sức khỏe tổng thể.
Không gian Spa yên tĩnh, đậm chất truyền thống Hà Nội, hoàn hảo để tĩnh tâm và thư giãn sau những giờ làm việc căng thẳng giữa lòng phố cổ.
Đội ngũ kỹ thuật viên nhiều năm kinh nghiệm, đào tạo bài bản từ Bệnh viện Châm cứu Trung ương dưới sự dẫn dắt của Giáo sư Tài Thu.
Chuyên viên làm đẹp, trị liệu đều có chứng chỉ nghề nghiệp, được đánh giá cao trên các nền tảng voucher uy tín tại Hà Nội.',
        918000.00,
        780000.00,
        'Khách hàng áp dụng:
Nam, Nữ.
Phòng dịch vụ:
Phòng VIP riêng.
Số lượng
E-Voucher áp dụng
:
Không giới hạn số lượng voucher áp dụng cho 01 khách.
Sử dụng
01 voucher/ 01 khách/ 01 lần sử dụng.
Thời gian áp dụng:
Áp dụng từ Thứ 2 đến Chủ nhật (trừ các ngày Lễ, Tết).
Khung giờ: 09h30 - 22h30.
Lưu ý:
Khách hàng vui lòng đặt chỗ trước khi đến để được phục vụ tốt nhất.
Khách hàng vui lòng liên hệ trước khi qua Spa.
Phụ thu:
Tiền TIP tối thiểu từ 100.000 vnđ/1 người.
Thông tin liên hệ:
Địa chỉ: 72B phố Trần Hưng Đạo, phường Trần Hưng Đạo, Quận Hoàn Kiếm, TP Hà Nội - Hotline: 0243.63.73.999 / 077 2760863
Địa chỉ: Số 20 Hàng Tre, Quận Hoàn Kiếm, TP Hà Nội - Hotline: 024 39879797 / 085 7879797
Điều kiện bắt buộc:
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mãi khác.
Giá đã bao gồm VAT.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/Sen-Tai-Thu-13_11052026115143.jpg?sign=XmI-SZOR9Wzo8Vs69PZonA',
        0,
        '40000000-0000-0000-0000-000000000002'
    ),
    (
        'd935bbcf-c6a7-4fab-89d1-42bd8bc7757b',
        'Sen Hàng Tre và Trần Hưng Đạo - Gói trị liệu điểm đau 60 phút phòng tiêu chuẩn',
        'Voucher áp dụng cho "Gói trị liệu điểm đau 60 phút phòng tiêu chuẩn tại Sen Hàng Tre & Sen Trần Hưng Đạo" giúp bạn thư giãn và làm mới chính mình trong một môi trường đầy sự chăm sóc và tận tâm.
Trị liệu theo vùng đau của khách hàng chườm ngải cứu tươi hấp nóng toàn thân, đắp mặt nạ ngũ hoa.
Không gian spa thiết kế ấm cúng và sang trọng theo phong cách Indochine kết hợp với tân cổ điển, tạo nên một môi trường độc đáo và ấn tượng.
Đội ngũ kỹ thuật viên dày dạn kinh nghiệm, được đào tạo bài bản và kiểm tra nghiêm ngặt theo chuẩn y học cổ truyền.
Cơ sở vật chất hiện đại và đa dạng, với nhiều loại phòng chuyên biệt như phòng đơn, phòng đôi, phòng ba, phòng tập thể và phòng VIP Deluxe, mang đến sự thoải mái tối đa cho khách hàng.
Spa áp dụng phương pháp chăm sóc sức khỏe và trị liệu theo y học cổ truyền Việt Nam, kết hợp với các sản phẩm từ thiên nhiên để đảm bảo hiệu quả tối ưu.',
        378000.00,
        323000.00,
        'Thởi gian 01 lần dịch vụ: 60 phút
Ngày áp dụng: Thứ 2 - Chủ nhật. Không áp dụng cho các ngày Lễ, tết
Giờ áp dụng: 09h30 - 22h30
Khách hàng áp dụng: Nữ/ Nam
Số lượng E-Voucher áp dụng:
Sử dụng 1 phiếu/ 1 người/ 1 lần dịch vụ (Không bù tiền)
Tiền TIP tối thiểu từ 100.000 VND/1 người
Khách hàng vui lòng liên hệ trước khi qua spa:
72B phố Trần Hưng Đạo, phường Trần Hưng Đạo, Quận Hoàn Kiếm, Thành phố Hà Nội - 0243 637 3999 Hoặc 077 276 0863 Hoặc 077 276 0863
Số 20 Hàng Tre, Quận Hoàn Kiếm, Thành phố Hà Nội - 024 3987 9797 Hoặc 085 787 9797
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa
Không áp dụng đồng thời với chương trình khuyến mại khác
Giá đã bao gồm VAT.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/Sen-Hang-Tre-Tran-Hung-Dao--1-_19052026172520.jpg?sign=RMHDBZrDk-vSpNqgMyu_Yw',
        0,
        '40000000-0000-0000-0000-000000000002'
    ),
    (
        '4288e641-09fc-44cd-8ec8-cfe2b8c5fa81',
        'Sen Hàng Tre và Trần Hưng Đạo - Gói trị liệu điểm đau 60 phút phòng Vip',
        'Voucher áp dụng cho "Gói trị liệu điểm đau 60 phút phòng Vip tại Sen Hàng Tre & Sen Trần Hưng Đạo" mang lại cảm giác thư thái, hoàn hảo.
Trị liệu theo vùng đau hoặc toàn thân, chườm ngải cứu tươi hấp nóng toàn thân, đắp mặt nạ ngũ hoa.
Không gian spa thiết kế ấm cúng và sang trọng theo phong cách Indochine kết hợp với tân cổ điển, tạo nên một môi trường độc đáo và ấn tượng.
Đội ngũ kỹ thuật viên dày dạn kinh nghiệm, được đào tạo bài bản và kiểm tra nghiêm ngặt theo chuẩn y học cổ truyền.
Cơ sở vật chất hiện đại và đa dạng, với nhiều loại phòng chuyên biệt như phòng đơn, phòng đôi, phòng ba, phòng tập thể và phòng VIP Deluxe, mang đến sự thoải mái tối đa cho khách hàng.
Spa áp dụng phương pháp chăm sóc sức khỏe và trị liệu theo y học cổ truyền Việt Nam, kết hợp với các sản phẩm từ thiên nhiên để đảm bảo hiệu quả tối ưu.',
        540000.00,
        460000.00,
        'Thời gian 01 lần dịch vụ: 60 phút
Ngày áp dụng: Thứ 2 - Chủ nhật. Không áp dụng cho các ngày Lễ, tết
Giờ áp dụng: 09h30 - 22h30
Khách hàng áp dụng: Nữ/ Nam
Số lượng E-Voucher áp dụng:
Sử dụng 1 phiếu/ 1 người/ 1 lần dịch vụ (Không bù tiền)
Tiền TIP tối thiểu từ 100.000 VND/1 người
Khách hàng vui lòng liên hệ trước khi qua spa:
72B phố Trần Hưng Đạo, phường Trần Hưng Đạo, Quận Hoàn Kiếm, Thành phố Hà Nội - 0243 637 3999 Hoặc 077 276 0863 Hoặc 077 276 0863
Số 20 Hàng Tre, Quận Hoàn Kiếm, Thành phố Hà Nội - 024 3987 9797 Hoặc 085 787 9797
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa
Không áp dụng đồng thời với chương trình khuyến mại khác
Giá đã bao gồm VAT.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/Sen-Hang-Tre-Tran-Hung-Dao_19052026170624.jpg?sign=4aiHSd9twshEHwDgR9v1Dg',
        0,
        '40000000-0000-0000-0000-000000000002'
    ),
    (
        'd7dee7ae-db95-4ef4-b80e-e708d54dddc0',
        'Sen Hàng Tre và Trần Hưng Đạo - Gói trị liệu cơ bản 105 phút phòng tiêu chuẩn',
        'Voucher áp dụng cho dịch vụ "Gói trị liệu cơ bản 105 phút phòng tiêu chuẩn tại Sen Hàng Tre & Sen Trần Hưng Đạo"
để tận hưởng sự chăm sóc tận tâm, nơi mà mọi giác quan của bạn được phục hồi và làm mới.
Khu xông hơi được trang bị 5 liệu pháp tắm - xông tiêu chuẩn, bao gồm xông hơi đá muối, xông hơi thảo dược, tắm lá Dao đỏ, ngâm bồn sục jacuzzi, và ngâm bể lạnh với nhiệt độ 18 độ C.
Không gian spa thiết kế ấm cúng và sang trọng theo phong cách Indochine kết hợp với tân cổ điển, tạo nên một môi trường độc đáo và ấn tượng.
Đội ngũ kỹ thuật viên dày dạn kinh nghiệm, được đào tạo bài bản và kiểm tra nghiêm ngặt theo chuẩn y học cổ truyền.
Cơ sở vật chất hiện đại và đa dạng, với nhiều loại phòng chuyên biệt như phòng đơn, phòng đôi, phòng ba, phòng tập thể và phòng VIP Deluxe, mang đến sự thoải mái tối đa cho khách hàng.
Spa áp dụng phương pháp chăm sóc sức khỏe và trị liệu theo y học cổ truyền Việt Nam, kết hợp với các sản phẩm từ thiên nhiên để đảm bảo hiệu quả tối ưu.',
        486000.00,
        416000.00,
        'Thời gian 01 lần dịch vụ: 105 phút
Ngày áp dụng: Thứ 2 - Chủ nhật. Không áp dụng cho các ngày Lễ, tết
Giờ áp dụng: 09h30 - 22h30
Khách hàng áp dụng: Nữ/ Nam
Số lượng E-Voucher áp dụng:
Sử dụng 1 phiếu/ 1 người/ 1 lần dịch vụ (Không bù tiền)
Tiền TIP tối thiểu từ 100.000 VND/1 người
Khách hàng vui lòng liên hệ trước khi qua spa:
72B phố Trần Hưng Đạo, phường Trần Hưng Đạo, Quận Hoàn Kiếm, Thành phố Hà Nội - 0243 637 3999 Hoặc 077 276 0863 Hoặc 077 276 0863
Số 20 Hàng Tre, Quận Hoàn Kiếm, Thành phố Hà Nội - 024 3987 9797 Hoặc 085 787 9797
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa
Không áp dụng đồng thời với chương trình khuyến mại khác
Giá đã bao gồm VAT.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/Sen-Tai-Thu-15_11052026114807.jpg?sign=dWyegKMQeplIuVYvGCDd4g',
        0,
        '40000000-0000-0000-0000-000000000002'
    ),
    (
        '36a9024d-a3a3-423d-bc9c-51652d95f726',
        'Sen Hàng Tre và Trần Hưng Đạo - Gói trị liệu cao cấp 150 phút phòng tiêu chuẩn',
        '"Trải nghiệm 150 phút massage tại Sen Hàng Tre & Sen Trần Hưng Đạo" giúp bạn thư giãn và làm mới chính mình trong một môi trường đầy sự chăm sóc và tận tâm.
Khu xông hơi được trang bị 5 liệu pháp tắm - xông tiêu chuẩn, bao gồm xông hơi đá muối, xông hơi thảo dược, tắm lá Dao đỏ, ngâm bồn sục jacuzzi, và ngâm bể lạnh với nhiệt độ 18 độ C.
Không gian spa thiết kế ấm cúng và sang trọng theo phong cách Indochine kết hợp với tân cổ điển, tạo nên một môi trường độc đáo và ấn tượng.
Đội ngũ kỹ thuật viên dày dạn kinh nghiệm, được đào tạo bài bản và kiểm tra nghiêm ngặt theo chuẩn y học cổ truyền.
Cơ sở vật chất hiện đại và đa dạng, với nhiều loại phòng chuyên biệt như phòng đơn, phòng đôi, phòng ba, phòng tập thể và phòng VIP Deluxe, mang đến sự thoải mái tối đa cho khách hàng.
Spa áp dụng phương pháp chăm sóc sức khỏe và trị liệu theo y học cổ truyền Việt Nam, kết hợp với các sản phẩm từ thiên nhiên để đảm bảo hiệu quả tối ưu.',
        756000.00,
        646000.00,
        'Thời gian 1 lần dịch vụ: 150 phút
Ngày áp dụng: Thứ 2 - Chủ nhật. Không áp dụng cho các ngày Lễ, tết
Giờ áp dụng: 09h30 - 22h30
Khách hàng áp dụng: Nữ/ Nam
Số lượng E-Voucher áp dụng:
Sử dụng 1 phiếu/ 1 người/ 1 lần dịch vụ (Không bù tiền)
Tiền TIP tối thiểu từ 100.000 VND/1 người
Khách hàng vui lòng liên hệ trước khi qua spa:
72B phố Trần Hưng Đạo, phường Trần Hưng Đạo, Quận Hoàn Kiếm, Thành phố Hà Nội - 0243 637 3999 Hoặc 077 276 0863 Hoặc 077 276 0863
Số 20 Hàng Tre, Quận Hoàn Kiếm, Thành phố Hà Nội - 024 3987 9797 Hoặc 085 787 9797
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa
Không áp dụng đồng thời với chương trình khuyến mại khác
Giá đã bao gồm VAT.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/Sen-Tai-Thu-06_11052026115729.jpg?sign=uecKZP_hp3yHH-uyu8-h8A',
        0,
        '40000000-0000-0000-0000-000000000002'
    ),
    (
        '65b47537-7516-4e0c-a8e4-1e56c1d3f171',
        'Sen Hàng Tre và Trần Hưng Đạo - Gói trị liệu chuyên sâu 120 phút phòng tiêu chuẩn',
        'Voucher áp dụng cho "Gói trị liệu chuyên sâu 120 phút phòng tiêu chuẩn tại Sen Hàng Tre & Sen Trần Hưng Đạo" mang lại cảm giác thư thái, hoàn hảo.
Khu xông hơi được trang bị 5 liệu pháp tắm - xông tiêu chuẩn, bao gồm xông hơi đá muối, xông hơi thảo dược, tắm lá Dao đỏ, ngâm bồn sục jacuzzi, và ngâm bể lạnh với nhiệt độ 18 độ C.
Không gian spa thiết kế ấm cúng và sang trọng theo phong cách Indochine kết hợp với tân cổ điển, tạo nên một môi trường độc đáo và ấn tượng.
Đội ngũ kỹ thuật viên dày dạn kinh nghiệm, được đào tạo bài bản và kiểm tra nghiêm ngặt theo chuẩn y học cổ truyền.
Cơ sở vật chất hiện đại và đa dạng, với nhiều loại phòng chuyên biệt như phòng đơn, phòng đôi, phòng ba, phòng tập thể và phòng VIP Deluxe, mang đến sự thoải mái tối đa cho khách hàng.
Spa áp dụng phương pháp chăm sóc sức khỏe và trị liệu theo y học cổ truyền Việt Nam, kết hợp với các sản phẩm từ thiên nhiên để đảm bảo hiệu quả tối ưu.',
        594000.00,
        509000.00,
        'Thởi gian 01 lần dịch vụ: 120 phút
Ngày áp dụng: Thứ 2 - Chủ nhật. Không áp dụng cho các ngày Lễ, tết
Giờ áp dụng: 09h30 - 22h30
Khách hàng áp dụng: Nữ/ Nam
Số lượng E-Voucher áp dụng:
Sử dụng 1 phiếu/ 1 người/ 1 lần dịch vụ (Không bù tiền)
Tiền TIP tối thiểu từ 100.000 VND/1 người
Khách hàng vui lòng liên hệ trước khi qua spa:
72B phố Trần Hưng Đạo, phường Trần Hưng Đạo, Quận Hoàn Kiếm, Thành phố Hà Nội - 0243 637 3999 Hoặc 077 276 0863 Hoặc 077 276 0863
Số 20 Hàng Tre, Quận Hoàn Kiếm, Thành phố Hà Nội - 024 3987 9797 Hoặc 085 787 9797
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa
Không áp dụng đồng thời với chương trình khuyến mại khác
Giá đã bao gồm VAT.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/Sen-Tai-Thu-14_11052026115055.jpg?sign=rQtoCt2tZprws9CdaSAKpg',
        0,
        '40000000-0000-0000-0000-000000000002'
    ),
    (
        '8d13098f-50f1-45b4-ad34-aaedf8eb7fc6',
        'Aurora Halong Cruises - Tour trải nghiệm hoàng hôn trên vịnh Hạ Long',
        'Du thuyền Aurora Halong Cruises 5 sao, tour hoàng hôn trên Vịnh Hạ Long.
Trải nghiệm riêng tư, sang trọng, thoải mái cho mọi du khách.
Thưởng thức bữa tối Á - Âu thượng hạng, hải sản tươi sống.
Hòa mình vào nhạc Acoustic, Karaoke hoặc trải nghiệm câu mực đêm.
Nhà hàng view vịnh, sức chứa 120 khách, hệ thống âm thanh - ánh sáng hiện đại.
Lịch trình tham quan hấp dẫn qua các biểu tượng nổi tiếng: Núi Bài Thơ, Cầu Bãi Cháy, Cung Cá Heo.
Đội ngũ nhân viên 5 sao, chuyên nghiệp, tận tâm.',
        950000.00,
        850000.00,
        'Ngày áp dụng
: Thứ 2 - chủ nhật
Thời gian áp dụng theo lịch trình:
18h00 - 22h00
Số lượng E-Voucher áp dụng
: 01 E-voucher/ 1 người
Dịch vụ bao gồm:
Lịch trình 4 tiếng trên tàu thăm quan Vịnh + tiệc tối 5 sao
Du thuyền sang trọng, tiêu chuẩn 5 sao
Điều hòa suốt hành trình trên du thuyền
01 Bữa trưa Buffet Âu- Á thượng hạng trên du thuyền
01 Bữa Brunch/ 01 bữa tối đối với chương trình tour sáng/ tối
Đồ uống chào mừng. khăn lạnh trên du thuyền
Tour tham quan 6 tiếng: Tham quan hang Sửng Sốt; Tắm biển, leo núi tại Đảo Titop;
Chèo thuyền Kayak hoặc ngồi thuyền nan tham quan hang Luồn. Tiệc hoàng hôn:
Nước ép trái cây, trái cây và bánh ngọt.
Bể sục Jacuzzi
Khăn tắm phục vụ miễn phí
Phí tham quan và vé thắng cảnh theo chương trình
Bảo hiểm theo vé tham quan
Chụp ảnh bằng flycam hoặc máy cơ
Dịch vụ không bao gồm:
Đồ uống order tại quầy bar, tiền Tip và chi phí cá nhân khác
Xe limousine hiện đại hai chiều cao tốc từ Phố Cổ Hà Nội - Tuần Châu - Hà Nội: 17 - 22 ghế (phụ thu 400.000 Vnđ/ 2 chiều, Xe shuttle bus 30 ghế: 300.000 vnd/ khách/ 2 chiều)
Nước khoáng trên xe Limousine: 2 chai/2 chiều/khách
Thuế VAT 8% và phụ phí
Thanh toán bằng thẻ trên tàu: 4-5% phí ngân hàng
Phụ thu:
Trẻ từ 1 đến 4 tuổi: Miễn phí cho 1 trẻ đi cùng đoàn 20 người lớn; trẻ thứ 2 phụ thu 200.000 vnđ. Nếu trẻ cao trên 1,2m, phụ huynh tự chi trả phát sinh vé tham quan nếu có.
Trẻ từ 5 đến 8 tuổi: Tính 75% giá người lớn.
Trẻ từ 9 tuổi trở lên: Tính 100% giá người lớn.
Phụ thu lễ 30/4, 1/5, 2/9: 100.000 vnđ/khách.
Thông tin liên hệ:
Hotline: 19002065
Điều kiện khác:
Khách hàng cần liên hệ đăng ký dịch vụ trước khi đến để được phục vụ tốt nhất.
E-voucher không có giá trị quy đổi thành tiền mặt.
Không trả lại tiền thừa khi sử dụng dịch vụ.
Không áp dụng đồng thời với chương trình khuyến mại khác.
Không hoàn/hủy booking sau khi xác nhận.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/2_27052026115342.jpg?sign=PQKu08cU_oy9sPPC_bG6IQ',
        0,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        'ed21dec3-ff53-4f41-b369-f4fad9c4ae33',
        'Aurora Halong Cruises - Hải trình 6 tiếng trên vịnh Hạ Long',
        'Hải trình 6 tiếng trên Vịnh Hạ Long bằng du thuyền Aurora Halong 5 sao.
Thưởng thức buffet trưa Á - Âu với hải sản tươi sống.
Thăm các điểm nổi tiếng: Động Sửng Sốt, Hang Luồn, Đảo Titop, Núi Bài Thơ.
Thư giãn trên Sundeck, tham gia Sunset Party và Happy Hour.
Dịch vụ Jacuzzi bốn mùa trên boong, view Vịnh tuyệt đẹp.
Du thuyền rộng rãi, thoải mái, riêng tư và sang trọng.
Đội ngũ nhân viên 5 sao chuyên nghiệp và tận tâm.',
        1100000.00,
        1000000.00,
        'Ngày áp dụng
: Thứ 2 - Chủ nhật.
Thứ 6,7, chủ nhật phụ thu 50.000Vnd/ 1 voucher
Thời gian áp dụng theo lịch trình:
12h00 -18h00
Số lượng E-Voucher áp dụng
: 01 E-voucher/ 1 người
Dịch vụ bao gồm:
Lịch trình 6 tiếng trên tàu thăm quan Vịnh + tiệc buffet trưa
Du thuyền sang trọng, tiêu chuẩn 5 sao
Điều hòa suốt hành trình trên du thuyền
01 Bữa trưa Buffet Âu - Á thượng hạng trên du thuyền
01 Bữa Brunch/ 01 bữa tối đối với chương trình tour sáng/ tối
Đồ uống chào mừng. khăn lạnh trên du thuyền
Tour tham quan 6 tiếng: Tham quan hang Sửng Sốt; Tắm biển, leo núi tại Đảo Titop;
Chèo thuyền Kayak hoặc ngồi thuyền nan tham quan hang Luồn. Tiệc hoàng hôn:
Nước ép trái cây, trái cây và bánh ngọt.
Bể sục Jacuzzi
Khăn tắm phục vụ miễn phí
Phí tham quan và vé thắng cảnh theo chương trình
Bảo hiểm theo vé tham quan
Chụp ảnh bằng flycam hoặc máy cơ
Dịch vụ không bao gồm:
Đồ uống order tại quầy bar, tiền Tip và chi phí cá nhân khác
Xe limousine hiện đại hai chiều cao tốc từ Phố Cổ Hà Nội - Tuần Châu - Hà Nội: 17 - 22 ghế (phụ thu 400.000 Vnđ/ 2 chiều, Xe shuttle bus 30 ghế: 300.000 vnd/ khách/ 2 chiều)
Nước khoáng trên xe Limousine: 2 chai/2 chiều/khách
Thuế VAT 8% và phụ phí
Thanh toán bằng thẻ trên tàu: 4-5% phí ngân hàng
Phụ thu:
Trẻ từ 1 đến 4 tuổi: Miễn phí cho 1 trẻ đi cùng đoàn 20 người lớn; trẻ thứ 2 phụ thu 200.000 vnđ. Nếu trẻ cao trên 1,2m, phụ huynh tự chi trả phát sinh vé tham quan nếu có.
Trẻ từ 5 đến 8 tuổi: Tính 75% giá người lớn.
Trẻ từ 9 tuổi trở lên: Tính 100% giá người lớn.
Phụ thu lễ 30/4, 1/5, 2/9: 100.000 vnđ/khách.
Thông tin liên hệ:
Hotline: 19002065
Điều kiện khác:
E-voucher không có giá trị quy đổi thành tiền mặt.
Không trả lại tiền thừa khi sử dụng dịch vụ.
Không áp dụng đồng thời với chương trình khuyến mại khác.
Không hoàn/hủy booking sau khi xác nhận.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/3_27052026115344.jpg?sign=W80MTcg1w7ZlRsTEDL6CFQ',
        0,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        '6c1b11e3-93e9-4f04-ac20-87f4144d3d1f',
        'Ruby Cruise - Du ngoạn Vịnh Hạ Long 2 ngày 1 đêm',
        'Cabin 16m² tiêu chuẩn với cửa sổ kính hướng biển, sức chứa tối đa 2 người lớn, đầy đủ tiện nghi hiện đại.
Trọn gói bữa ăn trên tàu: sáng, trưa, tối theo tiêu chuẩn nhà hàng 4 sao, mang đậm hương vị biển cả.
Miễn phí hướng dẫn viên tiếng Anh, vé tham quan, chèo kayak và dụng cụ câu mực đêm.
Du thuyền Ruby Cruise 4 sao – thiết kế gỗ truyền thống kết hợp đá cẩm thạch, phục vụ chu đáo và không khí riêng tư.
Hành trình khám phá Vịnh Hạ Long: đảo Titop, Hang Sửng Sốt, Hang Luồn, tiệc trà chiều và lớp nấu ăn.
Thư giãn hoàn hảo trên sundeck với Sunset Party và thưởng thức cảnh hoàng hôn diễm lệ trên Vịnh.
Xe đưa đón khứ hồi từ Hà Nội, hỗ trợ check-in tại nhà chờ riêng, có Wi-Fi miễn phí.
Đặt tour trên LifeLink để nhận ưu đãi độc quyền, số lượng có hạn cho kỳ nghỉ cuối tuần sắp tới!',
        4900000.00,
        4520000.00,
        'Dịch vụ bao gồm:
Hạng phòng
Deluxe Double/ Twin View với chỗ nghỉ tiện nghi, máy lạnh hiện đại
Tiện ích khác
Hướng dẫn viên nói tiếng Anh
Phí tham quan và vé tham quan
Tất cả các bữa ăn trên tàu: sáng, trưa, tối
Chèo thuyền kayak
Wi-Fi trên xe đưa đón và văn phòng chờ
Đồ uống chào mừng
Bảo hiểm và thuế GTGT
Thời gian nhận trả phòng:
Check-in sớm, check-out muộn: Tùy thuộc vào tình trạng phòng và có thể sẽ phụ thu theo quy định của khách sạn
Lưu ý:
Không bao gồm: Đồ uống, tiền thưởng và các chi phí cá nhân khác
Không bao gồm dịch vụ vận chuyển Hà Nội - Hạ Long - Hà Nội
Việc tăng phí vào cửa có thể được áp dụng vào năm 2026 theo Ban quản lý Vịnh Hạ Long
Không áp dụng trong dịp Lễ, Tết
Phụ thu:
Phụ thu dịch vụ xe bus: 200.000vnđ/chiều/người (nếu có đặt xe đón)
Phụ thu dịch vụ xe Limousine: 350.000vnđ/chiều/người (nếu có đặt xe đón)
Phụ thu Dạ tiệc bắt buộc: 700.000vnđ/người lớn và 500.000vnđ/trẻ em với các đêm: Giáng sinh (24/12), Giao thừa (31/12), Tết Nguyên đán (30/12 và 01, 02, 03 tháng Giêng Âm lịch)
Thông tin liên hệ:
Địa chỉ: Nhà chờ G55, Cảng số 2, Cảng tàu Quốc tế Tuần Châu - Quảng Ninh
Hotline: 1900 2065 hoặc 0934 661 016
Điều kiện khác:
01 e-Voucher áp dụng cho 2 người lớn/1 phòng
Khách hàng cần liên hệ đăng ký dịch vụ trước khi đến để được phục vụ tốt nhất
e-Voucher không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa
Không áp dụng đồng thời với chương trình khuyến mại khác
Không hoàn/hủy booking dưới bất kỳ hình thức nào',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/Ruby-Cruise-1_20052026170653.jpg?sign=8UUtGuXRoUXoBjsTEWINFQ',
        0,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        '9e8740fc-f9f8-46fa-8b83-02cdba1b3baf',
        'Lily Cruise - Du ngoạn Vịnh Hạ Long 2 ngày 1 đêm',
        'Phòng Deluxe Ocean View Cabin rộng 20m2, view biển tầng 1, sức chứa 2 người lớn & 1 trẻ em dưới 5 tuổi.
Tiện nghi phòng gồm tủ lạnh mini, phòng tắm khép kín, áo choàng, máy sấy tóc, két an toàn, hệ thống báo cháy.
Thưởng thức 4 bữa ăn đậm chất ẩm thực Việt và hải sản tươi sống ngay trên du thuyền sang trọng.
Khám phá bất tận Hạ Long với lịch trình thăm hang Sửng Sốt, đảo Titop, hang Luồn cùng trải nghiệm kayak.
Thư giãn tuyệt đối cùng tiệc trà chiều trên boong tàu, lớp học nấu ăn và hoạt động câu mực ban đêm thú vị.
Thiết kế du thuyền phong cách châu Âu cổ điển hòa quyện nét truyền thống Việt, đẳng cấp 4 sao.
Du thuyền trang bị hồ bơi, spa, jacuzzi, nhà hàng, bar và phục vụ thực phẩm Halal có chứng nhận.
Combo ưu đãi bao gồm vé tham quan, hướng dẫn viên tiếng Anh, đưa đón, Wi-Fi và bảo hiểm hành trình.',
        5900000.00,
        5400000.00,
        'Dịch vụ bao gồm:
Hạng phòng
Deluxe Ocean View với chỗ nghỉ tiện nghi, máy lạnh hiện đại
Tiện ích khác
Hướng dẫn viên nói tiếng Anh
Phí tham quan và vé tham quan
Tất cả các bữa ăn trên tàu: sáng, trưa, tối
Chèo thuyền kayak
Wi-Fi trên xe đưa đón và văn phòng chờ
Đồ uống chào mừng
Bảo hiểm và thuế GTGT
Thời gian nhận trả phòng:
Check-in sớm, check-out muộn: Tùy thuộc vào tình trạng phòng và có thể sẽ phụ thu theo quy định của khách sạn
Lưu ý:
Không bao gồm: Đồ uống, tiền thưởng và các chi phí cá nhân khác
Không bao gồm dịch vụ vận chuyển Hà Nội - Hạ Long - Hà Nội
Việc tăng phí vào cửa có thể được áp dụng vào năm 2026 theo Ban quản lý Vịnh Hạ Long
Không áp dụng trong dịp Lễ, Tết
Phụ thu:
Phụ thu dịch vụ xe bus: 200.000vnđ/chiều/người (nếu có đặt xe đón)
Phụ thu dịch vụ xe Limousine: 350.000vnđ/chiều/người (nếu có đặt xe đón)
Phụ thu Dạ tiệc bắt buộc: 700.000vnđ/người lớn và 500.000vnđ/trẻ em với các đêm: Giáng sinh (24/12), Giao thừa (31/12), Tết Nguyên đán (30/12 và 01, 02, 03 tháng Giêng Âm lịch)
Thông tin liên hệ:
Địa chỉ: Nhà chờ G55, Cảng số 2, Cảng tàu Quốc tế Tuần Châu - Quảng Ninh
Hotline: 1900 2065
Điều kiện khác:
01 e-Voucher áp dụng cho 2 người lớn/1 phòng
Khách hàng cần liên hệ đăng ký dịch vụ trước khi đến để được phục vụ tốt nhất
e-Voucher không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa
Không áp dụng đồng thời với chương trình khuyến mại khác
Không hoàn/hủy booking dưới bất kỳ hình thức nào',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/Lily-Cruise_27052026143448.jpg?sign=K5f9MTd7cSVawfScSz5Iaw',
        0,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        '63e0ea35-10a8-47af-96da-d45262567527',
        'SH Premium Lounge Tan Son Nhat tại Sân bay Quốc tế Tân Sơn Nhất- Vé trẻ em',
        'Phòng chờ Sông Hồng Premium Lounge Quốc nội - Nhà ga T3 tại sân bay Tân Sơn Nhất vé trẻ em - dành cho khách
từ 5 đến 12 tuổi.
Tọa lạc tại nhà ga T3 hiện đại, Sông Hồng Premium Lounge mang đến không gian nghỉ dưỡng sang trọng giữa nhịp sống sôi động của sân bay. Thiết kế lấy cảm hứng từ kiến trúc cung đình xưa kết hợp phong cách Neo-Vietnamese đương đại, sử dụng chất liệu truyền thống như gỗ, gốm, mây tre để tạo nên vẻ đẹp thanh lịch, đậm chất văn hóa Việt.
Phòng chờ được phân khu tinh tế, đáp ứng đa dạng nhu cầu từ nghỉ ngơi, làm việc đến thư giãn và ẩm thực. Thực đơn buffet phong phú, thay đổi linh hoạt trong ngày, kết hợp món Việt truyền thống và ẩm thực quốc tế. Tiện ích đầy đủ với ghế massage, khu hút thuốc, không gian làm việc riêng và tầm nhìn ra đường băng.
Điểm nhấn đặc biệt là dịch vụ chuẩn mực, đậm bản sắc Á Đông – nơi mỗi vị khách đều được đón tiếp bằng sự tinh tế, chuyên nghiệp và tận tâm.',
        245000.00,
        232750.00,
        'Voucher bao gồm:
Mã ưu đãi 1 lượt sử dụng dịch vụ phòng chờ SH Premium Lounge Tan Son Nhat tại Sân bay Quốc tế Tân Sơn Nhất - Vé trẻ em
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu
Địa điểm áp dụng: Tầng 4, Khu cách ly Quốc nội, Nhà ga T3, Cảng HKQT Tân Sơn Nhất
Vị trí: Ga đi Quốc nội - Sân Bay Tân Sơn Nhất - TP Hồ Chí Minh
Khách hàng được sử dụng mọi dịch vụ tại phòng chờ theo quy định của phòng chờ.
Mã ưu đãi chỉ có giá trị sử dụng một lần. Không chấp nhận Voucher ưu đãi quá hạn sử dụng hoặc trạng thái “Đã sử dụng”.
Vui lòng xuất trình mã ưu đãi cho nhân viên tại quầy để được áp dụng ưu đãi.
Khách hàng có thể được yêu cầu trả thêm tiền nếu sử dụng quá giá trị của Mã ưu đãi.
Lưu ý:
Khách hàng sẽ thanh toán trực tiếp tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại mỗi phòng chờ khi:
Khách hàng sử dụng quá thời gian quy định của phòng chờ.
Khách hàng có phát sinh các dịch vụ khác thêm tại phòng chờ
Khách hàng có trẻ em đi kèm mà chưa đăng ký dịch vụ trước qua LifeLink 1900 2065. Thời gian thông báo tối thiểu với LifeLink trước 1 ngày sử dụng dịch vụ LifeLink hoàn toàn không chịu trách nhiệm khi có các phát sinh thêm bên trên.
Khách hàng áp dụng: Khách trên 12 tuổi
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng: 24/24
Số lượng E-Voucher áp dụng:
01 voucher/khách/1 lượt sử dụng
Áp dụng nhiều voucher trên 1 hóa đơn
Dịch vụ bao gồm: Các dịch vụ theo tiêu chuẩn tại phòng chờ
Dịch vụ không bao gồm: Chi phí cá nhân và các chi phí phát sinh khác
Chính sách phụ thu trẻ em:
Miễn phí tối đa cho 02 trẻ em dưới 5 tuổi đi kèm cùng mỗi người lớn sử dụng dịch vụ Phòng khách.
Trẻ em dưới 5 tuổi thứ ba trở đi và Trẻ em từ 5 tuổi đến 12 tuổi mức phí bằng 50% đơn giá niêm yết/trẻ em.
Hành khách trên 12 tuổi được tính như quy định đối với người lớn.
Các trường hợp người đi kèm, nếu không được thông báo trước, dịch vụ gia tăng sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách.
Chính sách phụ thu sử dụng thêm giờ:
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu.
Cứ mỗi 03 (ba) tiếng thêm giờ phát sinh được xác định là 01 (một) khung thêm giờ (Block). Thời gian thêm giờ phát sinh dưới 3 (ba) tiếng được tính tròn là 01 (một) Block.
Đơn giá thêm giờ là: 50% phí dịch vụ /khách/ block (thêm giờ).
Hành khách tự thanh toán chi phí thêm giờ trực tiếp tại quầy lễ tân theo giá công bố tại phòng khách.
Quy trình sử dụng dịch vụ:
Bước 1: Khách hàng Xuất trình xuất trình mã ưu đãi/ mã QR trên ứng dụng LifeLink/ hoặc email/ hoặc Zalo cùng Thẻ lên tàu bay tại quầy lễ tân Phòng khách.
Bước 2: Nhân viên Phòng khách xác thực mã QR trên hệ thống.
Trường hợp 1: Xác thực không thành công: Nhân viên Lễ tân Phòng khách từ chối phục vụ khách đồng thời Nhờ khách hàng liên hệ lại Hotline LifeLink 1900 2065 để được hỗ trợ nhanh chóng.
Trường hợp 2: Xác thực thành công: Nhân viên Lễ tân Phòng khách hoàn tất trên hệ thống.
Bước 3: Nhân viên Lễ tân Phòng khách mời Hành khách sử dụng Dịch vụ Phòng chờ Thương gia.
Điều kiện lưu ý bắt buộc:
Các trường hợp phát sinh không thông báo trước như: Có vé trẻ em đi kèm,... sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách, LifeLink hoàn toàn không chịu trách nhiệm.
Thời gian thông báo tối thiểu trước 1 ngày sử dụng dịch vụ
Hotline hỗ trợ tư vấn (9h-20h): 1900 2065
Điều kiện khác:
Áp dụng 01 E-Voucher/E-Coupon cho 01 khách
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Mã ưu đãi được xuất ra sẽ không được đổi trả dưới mọi hình thức.
Giá trên đã bao gồm phí phục vụ và thuế GTGT',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/2_13052026140821.jpg?sign=WCHCvxbKTt6ODAudw8WGMg',
        0,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        'fa973101-1560-4feb-bc81-1cb962ef8485',
        'SH Premium Lounge Tan Son Nhat tại Sân bay Quốc tế Tân Sơn Nhất - Vé người lớn',
        'Tọa lạc tại nhà ga T3 hiện đại, Sông Hồng Premium Lounge mang đến không gian nghỉ dưỡng sang trọng giữa nhịp sống sôi động của sân bay. Thiết kế lấy cảm hứng từ kiến trúc cung đình xưa kết hợp phong cách Neo-Vietnamese đương đại, sử dụng chất liệu truyền thống như gỗ, gốm, mây tre để tạo nên vẻ đẹp thanh lịch, đậm chất văn hóa Việt.
Phòng chờ được phân khu tinh tế, đáp ứng đa dạng nhu cầu từ nghỉ ngơi, làm việc đến thư giãn và ẩm thực. Thực đơn buffet phong phú, thay đổi linh hoạt trong ngày, kết hợp món Việt truyền thống và ẩm thực quốc tế. Tiện ích đầy đủ với ghế massage, khu hút thuốc, không gian làm việc riêng và tầm nhìn ra đường băng.
Điểm nhấn đặc biệt là dịch vụ chuẩn mực, đậm bản sắc Á Đông – nơi mỗi vị khách đều được đón tiếp bằng sự tinh tế, chuyên nghiệp và tận tâm.',
        490000.00,
        465500.00,
        'Voucher bao gồm:
Mã ưu đãi 1 lượt sử dụng dịch vụ phòng chờ SH Premium Lounge Tan Son Nhat tại Sân bay Quốc tế Tân Sơn Nhất - Vé người lớn
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu
Địa điểm áp dụng: Tầng 4, Khu cách ly Quốc nội, Nhà ga T3, Cảng HKQT Tân Sơn Nhất
Vị trí: Ga đi Quốc nội - Sân Bay Tân Sơn Nhất - TP Hồ Chí Minh
Khách hàng được sử dụng mọi dịch vụ tại phòng chờ theo quy định của phòng chờ.
Mã ưu đãi chỉ có giá trị sử dụng một lần. Không chấp nhận Voucher ưu đãi quá hạn sử dụng hoặc trạng thái “Đã sử dụng”.
Vui lòng xuất trình mã ưu đãi cho nhân viên tại quầy để được áp dụng ưu đãi.
Khách hàng có thể được yêu cầu trả thêm tiền nếu sử dụng quá giá trị của Mã ưu đãi.
Lưu ý:
Khách hàng sẽ thanh toán trực tiếp tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại mỗi phòng chờ khi:
Khách hàng sử dụng quá thời gian quy định của phòng chờ.
Khách hàng có phát sinh các dịch vụ khác thêm tại phòng chờ
Khách hàng có trẻ em đi kèm mà chưa đăng ký dịch vụ trước qua LifeLink 1900 2065. Thời gian thông báo tối thiểu với LifeLink trước 1 ngày sử dụng dịch vụ LifeLink hoàn toàn không chịu trách nhiệm khi có các phát sinh thêm bên trên.
Khách hàng áp dụng: Khách trên 12 tuổi
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng: 24/24
Số lượng E-Voucher áp dụng:
01 voucher/khách/1 lượt sử dụng
Áp dụng nhiều voucher trên 1 hóa đơn
Dịch vụ bao gồm: Các dịch vụ theo tiêu chuẩn tại phòng chờ
Dịch vụ không bao gồm: Chi phí cá nhân và các chi phí phát sinh khác
Chính sách phụ thu trẻ em:
Miễn phí tối đa cho 02 trẻ em dưới 5 tuổi đi kèm cùng mỗi người lớn sử dụng dịch vụ Phòng khách.
Trẻ em dưới 5 tuổi thứ ba trở đi và Trẻ em từ 5 tuổi đến 12 tuổi mức phí bằng 50% đơn giá niêm yết/trẻ em.
Hành khách trên 12 tuổi được tính như quy định đối với người lớn.
Các trường hợp người đi kèm, nếu không được thông báo trước, dịch vụ gia tăng sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách.
Chính sách phụ thu sử dụng thêm giờ:
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu.
Cứ mỗi 03 (ba) tiếng thêm giờ phát sinh được xác định là 01 (một) khung thêm giờ (Block). Thời gian thêm giờ phát sinh dưới 3 (ba) tiếng được tính tròn là 01 (một) Block.
Đơn giá thêm giờ là: 50% phí dịch vụ /khách/ block (thêm giờ).
Hành khách tự thanh toán chi phí thêm giờ trực tiếp tại quầy lễ tân theo giá công bố tại phòng khách.
Quy trình sử dụng dịch vụ:
Bước 1: Khách hàng Xuất trình xuất trình mã ưu đãi/ mã QR trên ứng dụng LifeLink/ hoặc email/ hoặc Zalo cùng Thẻ lên tàu bay tại quầy lễ tân Phòng khách.
Bước 2: Nhân viên Phòng khách xác thực mã QR trên hệ thống.
Trường hợp 1: Xác thực không thành công: Nhân viên Lễ tân Phòng khách từ chối phục vụ khách đồng thời Nhờ khách hàng liên hệ lại Hotline LifeLink 1900 2065 để được hỗ trợ nhanh chóng.
Trường hợp 2: Xác thực thành công: Nhân viên Lễ tân Phòng khách hoàn tất trên hệ thống.
Bước 3: Nhân viên Lễ tân Phòng khách mời Hành khách sử dụng Dịch vụ Phòng chờ Thương gia.
Điều kiện lưu ý bắt buộc:
Các trường hợp phát sinh không thông báo trước như: Có vé trẻ em đi kèm,... sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách, LifeLink hoàn toàn không chịu trách nhiệm.
Thời gian thông báo tối thiểu trước 1 ngày sử dụng dịch vụ
Hotline hỗ trợ tư vấn (9h-20h): 1900 2065
Điều kiện khác:
Áp dụng 01 E-Voucher/E-Coupon cho 01 khách
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Mã ưu đãi được xuất ra sẽ không được đổi trả dưới mọi hình thức.
Giá trên đã bao gồm phí phục vụ và thuế GTGT',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/Phòng-chờ-SH-Premium-Lounge-Tan-Son-Nhat_13052026141039.jpg?sign=vU8_1R8OPiNHmNfKN2RW1A',
        0,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        '5da7a165-94dd-4f0d-ad33-0d7edf13d3e8',
        'SH Premium Lounge Phu Bai tại Sân bay Quốc tế Phú Bài - Vé trẻ em',
        'Voucher áp dụng cho "SH Premium Lounge Phu Bai tại Sân bay Quốc tế Phú Bài - Vé trẻ em" mang đến cho quý khách một không gian dừng chân lý tưởng, đẳng cấp.
Phòng chờ
SH Premium Lounge Phu Bai
sở hữu phong cách kiến trúc hiện đại, có bố cục và nội thất được thiết kế tỉ mỉ, mang dấu ấn riêng biệt, cùng dịch vụ định hướng 5 sao.
Phòng chờ được chia thành nhiều khu vực chức năng như: chỗ nghỉ ngơi, quầy bar/ buffet, phòng hút thuốc... luôn đáp ứng một các tốt nhất nhu cầu đa dạng của hành khách.
Đặc biệt, menu đa dạng, chế biến khéo léo và bày trí đẹp mắt từ các truyền thống của Huế như: bánh bột lọc, nem lụi, trà cung đình Huế... đến những món khai vị/ đồ uống/ đồ tráng miệng đặc sắc.
Với đội ngũ nhân viên chuyên nghiệp, chu đáo, nhiệt tình cùng phong cách phục vụ cởi mở, chân thành, hiếu khách, Phòng chờ
SH Premium Lounge Phu Bai
hứa hẹn làm hài lòng mọi quý khách hàng.',
        200000.00,
        190000.00,
        'Voucher bao gồm:
Mã ưu đãi 1 lượt sử dụng dịch vụ phòng chờ SH Premium Lounge Phu Bai tại Sân bay Quốc tế Phú Bài - Vé trẻ em
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu
Địa điểm áp dụng: Tầng 2, Khu cách ly Quốc nội, Cảng HKQT Phú Bài
Vị trí: Ga đi Quốc nội - Sân Bay Phú Bài - Huế
Khách hàng được sử dụng mọi dịch vụ tại phòng chờ theo quy định của phòng chờ.
Mã ưu đãi chỉ có giá trị sử dụng một lần. Không chấp nhận Voucher ưu đãi quá hạn sử dụng hoặc trạng thái “Đã sử dụng”.
Vui lòng xuất trình mã ưu đãi cho nhân viên tại quầy để được áp dụng ưu đãi.
Khách hàng có thể được yêu cầu trả thêm tiền nếu sử dụng quá giá trị của Mã ưu đãi.
Lưu ý:
Khách hàng sẽ thanh toán trực tiếp tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại mỗi phòng chờ khi:
Khách hàng sử dụng quá thời gian quy định của phòng chờ.
Khách hàng có phát sinh các dịch vụ khác thêm tại phòng chờ
Khách hàng có trẻ em đi kèm mà chưa đăng ký dịch vụ trước qua LifeLink 1900 2065. Thời gian thông báo tối thiểu với LifeLink trước 1 ngày sử dụng dịch vụ LifeLink hoàn toàn không chịu trách nhiệm khi có các phát sinh thêm bên trên."
Khách hàng áp dụng: Khách từ 5 đến 12 tuổi
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng: 06:00 - 22:00
Số lượng E-Voucher áp dụng:
01 voucher/khách/1 lượt sử dụng
Áp dụng nhiều voucher trên 1 hóa đơn
Dịch vụ bao gồm: Các dịch vụ theo tiêu chuẩn tại phòng chờ
Dịch vụ không bao gồm: Chi phí cá nhân và các chi phí phát sinh khác
Chính sách phụ thu trẻ em
Miễn phí tối đa cho 02 trẻ em dưới 5 tuổi đi kèm cùng mỗi người lớn sử dụng dịch vụ Phòng khách.
Trẻ em dưới 5 tuổi thứ ba trở đi và Trẻ em từ 5 tuổi đến 12 tuổi mức phí bằng 50% đơn giá niêm yết/trẻ em.
Hành khách trên 12 tuổi được tính như quy định đối với người lớn.
Các trường hợp người đi kèm, nếu không được thông báo trước, dịch vụ gia tăng sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách.
Chính sách phụ thu sử dụng thêm giờ
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu.
Cứ mỗi 03 (ba) tiếng thêm giờ phát sinh được xác định là 01 (một) khung thêm giờ (Block). Thời gian thêm giờ phát sinh dưới 3 (ba) tiếng được tính tròn là 01 (một) Block.
Đơn giá thêm giờ là: 50% phí dịch vụ /khách/ block (thêm giờ).
Hành khách tự thanh toán chi phí thêm giờ trực tiếp tại quầy lễ tân theo giá công bố tại phòng khách.
Quy trình sử dụng dịch vụ
Bước 1: Khách hàng Xuất trình xuất trình mã ưu đãi/ mã QR trên ứng dụng LifeLink/ hoặc email/ hoặc Zalo cùng Thẻ lên tàu bay tại quầy lễ tân Phòng khách.
Bước 2: Nhân viên Phòng khách xác thực mã QR trên hệ thống.
Trường hợp 1: Xác thực không thành công: Nhân viên Lễ tân Phòng khách từ chối phục vụ khách đồng thời Nhờ khách hàng liên hệ lại Hotline LifeLink 1900 2065 để được hỗ trợ nhanh chóng.
Trường hợp 2: Xác thực thành công: Nhân viên Lễ tân Phòng khách hoàn tất trên hệ thống.
Bước 3: Nhân viên Lễ tân Phòng khách mời Hành khách sử dụng Dịch vụ Phòng chờ Thương gia.
Điều kiện lưu ý bắt buộc
Các trường hợp phát sinh không thông báo trước như: Có vé trẻ em đi kèm,... sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách, LifeLink hoàn toàn không chịu trách nhiệm.
Thời gian thông báo tối thiểu trước 1 ngày sử dụng dịch vụ
Hotline hỗ trợ tư vấn (9h-20h): 1900 2065
Điều kiện khác
Áp dụng 01 E-Voucher/E-Coupon cho 01 khách
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Mã ưu đãi được xuất ra sẽ không được đổi trả dưới mọi hình thức.
Giá trên đã bao gồm phí phục vụ và thuế GTGT',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/2_13052026160452.jpg?sign=1oXEFpVK8FoZYuisvFy3UA',
        0,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        '1ce33133-d1e2-48d1-97e4-8c7c847faa61',
        'Fast Lane - Phụ thu lễ tết đón tiễn đêm từ 22h30 đến 6h00',
        'Đón khách tại điểm đón khách nhà ga Quốc tế.
Hỗ trợ nhập cảnh nhanh chóng, ưu tiên.
Có hỗ trợ làm E-visa khi cần.
Rút ngắn tối đa thời gian chờ đợi tại sân bay.
Phù hợp doanh nhân, khách đoàn, gia đình có trẻ nhỏ.
Trải nghiệm dịch vụ chuyên nghiệp, thuận tiện.
Đặt ngay tại LifeLink để nhận voucher giảm giá, đặt dịch vụ tiện lợi.',
        100000.00,
        100000.00,
        'Voucher áp dụng cho dịch vụ Fast Lane - Đón Quốc Tế Tiêu chuẩn tại Sân bay Quốc tế Tân Sơn Nhất, bao gồm:
Đón khách ở điểm đón khách tại nhà ga quốc tế.
Hỗ trợ khách làm thủ tục nhập cảnh.
Địa điểm áp dụng: Tầng 1, Nhà ga T2, sân bay Tân Sơn Nhất
Khách hàng áp dụng: Tất cả khách hàng
Quy trình sử dụng Quy trình sử dụng dịch vụ:
Bước 1: Khách hàng liên hệ LifeLink để kiểm tra dịch vụ
Bước 2: Khách mua và nhận mã voucher từ LifeLink.vn qua zalo/ email.
Bước 3: Khách hàng có nhu cầu sử dụng sẽ liên hệ hotline 1900 2065 và đặt ít nhất trước 01 ngày sử dụng dịch vụ.
Bước 4: Nhân viên mặt đất tại sân bay đón khách với bảng đón tại điểm hẹn tại Nhà ga quốc tế
Bước 5: Khách hàng gặp nhân viên và sử dụng dịch vụ
Phụ thu:
Phụ thu Đón/Tiễn đêm: Từ 22h30 - 06h00: 100.000 Vnđ/khách.
Phụ thu ngày lễ, tết: Theo quy định của Nhà nước: 100.000 Vnđ/khách.
Giá trên đã bao gồm thuế GTGT.
Đặt dịch vụ tối thiểu 24 tiếng trước giờ bay.
Huỷ dịch vụ tối thiểu 12 tiếng trước giờ bay.
Thời gian áp dụng: Theo chuyến bay - Cần liên hệ LifeLink để đặt dịch vụ ít nhất 24h (1 ngày)
Điều kiện đặt dịch vụ
Hotline đặt tư vấn (9h-20h): 1900 2065
Liên hệ LifeLink trước khi thanh toán dịch vụ, đặt ít nhất trước 24h (1 ngày) để đảm bảo nhận được dịch vụ tốt nhất
Điều kiện khác
Áp dụng 01 E-Voucher/E-Coupon cho 01 khách
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/fast-track-dich-vu-don-goi-tieu-chuan-ga-qt-tan-son-nhat-noi-bai-da-nang-phu-quoc-cam-ranh_27052026140738.jpg?sign=yhLaP4mTOsS2aOyZcE-x0Q',
        0,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        '1905e542-d55d-449f-bde5-e76c158c9d01',
        'Evisa - Dịch vụ hỗ trợ lấy thị thực Online',
        'Visa điện tử Việt Nam - Evisa là hình thức cấp visa hoàn toàn online, nhanh chóng, an toàn.
Thích hợp cho người nước ngoài đến Việt Nam du lịch, công tác, đầu tư hoặc thăm thân nhân.
Không cần đến Đại sứ quán/Lãnh sự quán hay xếp hàng lấy visa tại sân bay truyền thống.
Được cấp trực tuyến bởi Cục Quản lý Xuất nhập cảnh Việt Nam, đảm bảo chính thống, minh bạch.
Tiết kiệm thời gian, dễ dàng đăng ký từ bất cứ nơi đâu chỉ với vài bước đơn giản.
Thủ tục minh bạch, thông tin bảo mật, kiểm tra theo dõi tiến trình online tiện lợi.
Phù hợp đa dạng đối tượng: khách du lịch, doanh nhân, nhà đầu tư, người đi thăm gia đình.
Ưu đãi khi đặt qua LifeLink – xác nhận nhanh, hỗ trợ khách tận tình suốt quá trình hoàn tất thủ tục.',
        200000.00,
        190000.00,
        'Voucher áp dụng cho dịch vụ Hỗ trợ lấy thị thực, bao gồm:
Hỗ trợ khách chuyển đổi visa nhập cảnh nhanh.
Địa điểm áp dụng: Online
Khách hàng áp dụng: Tất cả khách hàng
Giá trên đã bao gồm thuế GTGT.
Điều kiện đặt dịch vụ
Hotline đặt tư vấn (9h-20h): 1900 2065
Liên hệ LifeLink trước khi thanh toán dịch vụ, đặt ít nhất trước 24h (1 ngày) để đảm bảo nhận được dịch vụ tốt nhất
Điều kiện khác
Áp dụng 01 E-Voucher/E-Coupon cho 01 khách
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/Evisa-Dich-vu-ho-tro-lay-thi-thuc-Online_30062026111126.jpg?sign=mkAyfZGyM6KX8Lxp1k1znA',
        0,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        '1549fecd-90b6-40e3-9ef3-234ae1149959',
        'SH Premium Lounge Ha Noi 3 tại Sân bay Quốc tế Nội Bài - Vé trẻ em',
        'Phòng chờ cao cấp dành riêng cho trẻ em tại ga quốc tế T2, sân bay Nội Bài, tạo cảm giác thoải mái như ở nhà.
Menu buffet thay đổi theo ngày, phong phú và phù hợp khẩu vị đa dạng, bao gồm cả đồ uống có cồn và không cồn.
Không gian hiện đại với ghế sofa êm ái, điều hòa mát mẻ và khu vực giải trí đa phương tiện.
Có màn hình hiển thị thông tin chuyến bay, giúp phụ huynh tiện theo dõi lịch trình di chuyển.
Cung cấp dịch vụ truyền hình cáp giải trí, báo - tạp chí giúp trẻ không bị nhàm chán khi chờ chuyến bay.
Hỗ trợ truy cập internet, email và các tiện ích dành cho khách có nhu cầu công việc khẩn cấp.
Không gian toilet riêng biệt, sạch sẽ và tiện nghi, phù hợp với trẻ nhỏ cần sử dụng thường xuyên.
Đặt dịch vụ qua LifeLink để tận hưởng giá ưu đãi và trải nghiệm không gian chờ tiện nghi nhất cho bé yêu.',
        525000.00,
        498750.00,
        'Voucher bao gồm:
Mã ưu đãi 1 lượt sử dụng dịch vụ phòng chờ SH Premium Lounge Ha Noi 3 tại Sân bay Quốc tế Nội Bài - Vé trẻ em
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu
Địa điểm áp dụng: Tầng 4, cánh Tây, khu cách ly ga đi Quốc tế, Cảng Hàng không Quốc tế Nội Bài (gần gate 37 & 38)
Vị trí: Ga đi Quốc tế - Sân Bay Nội Bài - Hà Nội
Khách hàng được sử dụng mọi dịch vụ tại phòng chờ theo quy định của phòng chờ.
Mã ưu đãi chỉ có giá trị sử dụng một lần. Không chấp nhận Voucher ưu đãi quá hạn sử dụng hoặc trạng thái “Đã sử dụng”.
Vui lòng xuất trình mã ưu đãi cho nhân viên tại quầy để được áp dụng ưu đãi.
Khách hàng có thể được yêu cầu trả thêm tiền nếu sử dụng quá giá trị của Mã ưu đãi.
Lưu ý:
Khách hàng sẽ thanh toán trực tiếp tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại mỗi phòng chờ khi:
Khách hàng sử dụng quá thời gian quy định của phòng chờ.
Khách hàng có phát sinh các dịch vụ khác thêm tại phòng chờ
Khách hàng có trẻ em đi kèm mà chưa đăng ký dịch vụ trước qua LifeLink 1900 2065. Thời gian thông báo tối thiểu với LifeLink trước 1 ngày sử dụng dịch vụ LifeLink hoàn toàn không chịu trách nhiệm khi có các phát sinh thêm bên trên.
Khách hàng áp dụng: Khách từ 5 đến 12 tuổi
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng 06:00 - 02:00 (ngày hôm sau)
Số lượng E-Voucher áp dụng:
01 voucher/khách/1 lượt sử dụng
Áp dụng nhiều voucher trên 1 hóa đơn
Dịch vụ bao gồm: Các dịch vụ theo tiêu chuẩn tại phòng chờ
Dịch vụ không bao gồm: Chi phí cá nhân và các chi phí phát sinh khác
Chính sách phụ thu trẻ em:
Miễn phí tối đa cho 02 trẻ em dưới 5 tuổi đi kèm cùng mỗi người lớn sử dụng dịch vụ Phòng khách.
Trẻ em dưới 5 tuổi thứ ba trở đi và Trẻ em từ 5 tuổi đến 12 tuổi mức phí bằng 50% đơn giá niêm yết/trẻ em.
Hành khách trên 12 tuổi được tính như quy định đối với người lớn.
Các trường hợp người đi kèm, nếu không được thông báo trước, dịch vụ gia tăng sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách.
Chính sách phụ thu sử dụng thêm giờ:
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu.
Cứ mỗi 03 (ba) tiếng thêm giờ phát sinh được xác định là 01 (một) khung thêm giờ (Block). Thời gian thêm giờ phát sinh dưới 3 (ba) tiếng được tính tròn là 01 (một) Block.
Đơn giá thêm giờ là: 50% phí dịch vụ /khách/ block (thêm giờ).
Hành khách tự thanh toán chi phí thêm giờ trực tiếp tại quầy lễ tân theo giá công bố tại phòng khách.
Quy trình sử dụng dịch vụ:
Bước 1: Khách hàng Xuất trình xuất trình mã ưu đãi/ mã QR trên ứng dụng LifeLink/ hoặc email/ hoặc Zalo cùng Thẻ lên tàu bay tại quầy lễ tân Phòng khách.
Bước 2: Nhân viên Phòng khách xác thực mã QR trên hệ thống.
Trường hợp 1: Xác thực không thành công: Nhân viên Lễ tân Phòng khách từ chối phục vụ khách đồng thời Nhờ khách hàng liên hệ lại Hotline LifeLink 1900 2065 để được hỗ trợ nhanh chóng.
Trường hợp 2: Xác thực thành công: Nhân viên Lễ tân Phòng khách hoàn tất trên hệ thống.
Bước 3: Nhân viên Lễ tân Phòng khách mời Hành khách sử dụng Dịch vụ Phòng chờ Thương gia."
Điều kiện lưu ý bắt buộc
Các trường hợp phát sinh không thông báo trước như: Có vé trẻ em đi kèm,... sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách, LifeLink hoàn toàn không chịu trách nhiệm.
Thời gian thông báo tối thiểu trước 1 ngày sử dụng dịch vụ
Hotline hỗ trợ tư vấn (9h-20h): 1900 2065
Điều kiện khác:
Áp dụng 01 E-Voucher/E-Coupon cho 01 khách
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Mã ưu đãi được xuất ra sẽ không được đổi trả dưới mọi hình thức.
Giá trên đã bao gồm phí phục vụ và thuế GTGT',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/1_13052026114922.jpg?sign=pBEB49HwjLmEASb5hsq1bQ',
        0,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        '0935789a-1a42-4ebd-b16d-e86266b214dc',
        'Jasmine Halal Lounge - Ga Quốc tế T2 tại Sân bay Quốc tế Tân Sơn Nhất - Vé người lớn',
        'Trải nghiệm phòng chờ sân bay Jasmine Halal Lounge tại nhà ga quốc tế T2 Tân Sơn Nhất.
Thực đơn buffet phong phú thay đổi theo ngày, kết hợp nhiều món ăn hấp dẫn.
Thưởng thức thức uống đa dạng: cà phê, trà, nước ép, nước ngọt và đồ uống có cồn.
Không gian ngồi ghế sofa êm ái, thoải mái thư giãn trong khi chờ lên máy bay.
Phòng chờ được trang bị internet tốc độ cao, máy tính, máy in phục vụ công việc.
Trang bị tiện nghi hiện đại: điều hòa, truyền hình cáp, màn hình hiển thị chuyến bay.
Khu vực vệ sinh riêng, máy đánh giày, báo và tạp chí miễn phí cho khách đọc.
Đặt voucher dễ dàng qua LifeLink – nhận e-voucher nhanh, giá ưu đãi hấp dẫn.',
        1000000.00,
        950000.00,
        'Voucher bao gồm:
Mã ưu đãi 1 lượt sử dụng dịch vụ phòng chờ Jasmine Halal Lounge - Ga Quốc tế T2 tại Sân bay Quốc tế Tân Sơn Nhất - Vé người lớn
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu
Địa điểm áp dụng: Tầng 2, Khu cách ly Quốc Tế, Ga Quốc Tế, Sân Bay Quốc tế Tân Sơn Nhất
Vị trí: Ga đi Quốc tế - Sân Bay Tân Sơn Nhất - TP Hồ Chí Minh
Khách hàng được sử dụng mọi dịch vụ tại phòng chờ theo quy định của phòng chờ.
Mã ưu đãi chỉ có giá trị sử dụng một lần. Không chấp nhận Voucher ưu đãi quá hạn sử dụng hoặc trạng thái “Đã sử dụng”.
Vui lòng xuất trình mã ưu đãi cho nhân viên tại quầy để được áp dụng ưu đãi.
Khách hàng có thể được yêu cầu trả thêm tiền nếu sử dụng quá giá trị của Mã ưu đãi.
Lưu ý:
Khách hàng sẽ thanh toán trực tiếp tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại mỗi phòng chờ khi:
Khách hàng sử dụng quá thời gian quy định của phòng chờ.
Khách hàng có phát sinh các dịch vụ khác thêm tại phòng chờ
Khách hàng có trẻ em đi kèm mà chưa đăng ký dịch vụ trước qua LifeLink 1900 2065. Thời gian thông báo tối thiểu với LifeLink trước 1 ngày sử dụng dịch vụ LifeLink hoàn toàn không chịu trách nhiệm khi có các phát sinh thêm bên trên.
Khách hàng áp dụng: Khách trên 12 tuổi
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng: 24/24
Số lượng E-Voucher áp dụng:
01 voucher/khách/1 lượt sử dụng
Áp dụng nhiều voucher trên 1 hóa đơn
Dịch vụ bao gồm: Các dịch vụ theo tiêu chuẩn tại phòng chờ
Dịch vụ không bao gồm: Chi phí cá nhân và các chi phí phát sinh khác
Chính sách phụ thu trẻ em:
Mỗi khách người lớn được miễn phí tối đa 01 trẻ em dưới 5 tuổi.
Từ trẻ em dưới 5 tuổi thứ 2: Áp dụng Đơn giá trẻ em.
Khách từ 5 đến 12 tuổi: Áp dụng Đơn giá trẻ em.
Khách trên 12 tuổi: Áp dụng Đơn giá người lớn.
Các trường hợp người đi kèm, nếu không được thông báo trước, dịch vụ gia tăng sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách.
Chính sách phụ thu sử dụng thêm giờ:
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu.
Cứ mỗi 03 (ba) tiếng thêm giờ phát sinh được xác định là 01 (một) khung thêm giờ (Block). Thời gian thêm giờ phát sinh dưới 3 (ba) tiếng được tính tròn là 01 (một) Block.
Đơn giá thêm giờ là: 50% phí dịch vụ /khách/ block (thêm giờ).
Hành khách tự thanh toán chi phí thêm giờ trực tiếp tại quầy lễ tân theo giá công bố tại phòng khách.
Quy trình sử dụng dịch vụ:
Bước 1: Khách hàng Xuất trình xuất trình mã ưu đãi/ mã QR trên ứng dụng LifeLink/ hoặc email/ hoặc Zalo cùng Thẻ lên tàu bay tại quầy lễ tân Phòng khách.
Bước 2: Nhân viên Phòng khách xác thực mã QR trên hệ thống.
Trường hợp 1: Xác thực không thành công: Nhân viên Lễ tân Phòng khách từ chối phục vụ khách đồng thời Nhờ khách hàng liên hệ lại Hotline LifeLink 1900 2065 để được hỗ trợ nhanh chóng.
Trường hợp 2: Xác thực thành công: Nhân viên Lễ tân Phòng khách hoàn tất trên hệ thống.
Bước 3: Nhân viên Lễ tân Phòng khách mời Hành khách sử dụng Dịch vụ Phòng chờ Thương gia.
Điều kiện lưu ý bắt buộc:
Các trường hợp phát sinh không thông báo trước như: Có vé trẻ em đi kèm,... sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách, LifeLink hoàn toàn không chịu trách nhiệm.
Thời gian thông báo tối thiểu trước 1 ngày sử dụng dịch vụ
Hotline hỗ trợ tư vấn (9h-20h): 1900 2065
Điều kiện khác:
Áp dụng 01 E-Voucher/E-Coupon cho 01 khách
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Mã ưu đãi được xuất ra sẽ không được đổi trả dưới mọi hình thức.
Giá trên đã bao gồm phí phục vụ và thuế GTGT',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/2_13052026135931.jpg?sign=oB1kU3zbcu9hFjj1ylm4Iw',
        0,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        '03069af5-b8d8-4ea7-9020-d879853afff8',
        'SH Premium Lounge Phu Quoc 2 tại Sân bay quốc tế Phú Quốc - Vé trẻ em',
        'Không gian phòng chờ cao cấp tại sân bay quốc tế Phú Quốc, phù hợp cho gia đình có trẻ nhỏ trước giờ khởi hành.
Thiết kế lấy cảm hứng từ biển đảo Phú Quốc với gam màu xanh dịu nhẹ, nội thất gỗ tự nhiên và ánh sáng ngập tràn.
Ghế ngồi êm ái, khu vực nghỉ ngơi riêng tư, Wi-Fi tốc độ cao và phòng tắm tiện nghi giúp hành khách thư giãn tối đa.
Thực đơn buffet đa dạng với các món Việt Nam, món Âu, bánh ngọt, trái cây và nhiều loại đồ uống hấp dẫn.
Đội ngũ nhân viên chuyên nghiệp, tận tâm, hỗ trợ hành khách chu đáo trong suốt thời gian sử dụng dịch vụ.
Trẻ em được tận hưởng không gian thoải mái, giúp hành trình của cả gia đình trở nên dễ dàng và thư thái hơn.
Dễ dàng đặt vé trẻ em trên LifeLink với nhiều ưu đãi hấp dẫn, xác nhận nhanh và thanh toán thuận tiện.',
        225000.00,
        213750.00,
        'Voucher bao gồm:
Mã ưu đãi 1 lượt sử dụng dịch vụ phòng chờ SH Premium Lounge Phu Quoc 2 tại Sân bay quốc tế Phú Quốc - Vé trẻ em
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu
Địa điểm áp dụng: Tầng 2, Khu cách ly Quốc nội, Cảng HKQT Phú Quốc (gân cửa ra tàu bay số 12)
Vị trí: Ga đi Quốc nội - Sân Bay Phú Quốc - Phú Quốc
Khách hàng được sử dụng mọi dịch vụ tại phòng chờ theo quy định của phòng chờ.
Mã ưu đãi chỉ có giá trị sử dụng một lần. Không chấp nhận Voucher ưu đãi quá hạn sử dụng hoặc trạng thái “Đã sử dụng”.
Vui lòng xuất trình mã ưu đãi cho nhân viên tại quầy để được áp dụng ưu đãi.
Khách hàng có thể được yêu cầu trả thêm tiền nếu sử dụng quá giá trị của Mã ưu đãi.
Lưu ý:
Khách hàng sẽ thanh toán trực tiếp tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại mỗi phòng chờ khi:
Khách hàng sử dụng quá thời gian quy định của phòng chờ.
Khách hàng có phát sinh các dịch vụ khác thêm tại phòng chờ
Khách hàng có trẻ em đi kèm mà chưa đăng ký dịch vụ trước qua LifeLink 1900 2065. Thời gian thông báo tối thiểu với LifeLink trước 1 ngày sử dụng dịch vụ LifeLink hoàn toàn không chịu trách nhiệm khi có các phát sinh thêm bên trên.
Khách hàng áp dụng: Khách từ 5 đến 12 tuổi
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng: 06:00 - 20:00
Số lượng E-Voucher áp dụng:
01 voucher/khách/1 lượt sử dụng
Áp dụng nhiều voucher trên 1 hóa đơn
Dịch vụ bao gồm: Các dịch vụ theo tiêu chuẩn tại phòng chờ
Dịch vụ không bao gồm: Chi phí cá nhân và các chi phí phát sinh khác
Chính sách phụ thu trẻ em
Miễn phí tối đa cho 02 trẻ em dưới 5 tuổi đi kèm cùng mỗi người lớn sử dụng dịch vụ Phòng khách.
Trẻ em dưới 5 tuổi thứ ba trở đi và Trẻ em từ 5 tuổi đến 12 tuổi mức phí bằng 50% đơn giá niêm yết/trẻ em.
Hành khách trên 12 tuổi được tính như quy định đối với người lớn.
Các trường hợp người đi kèm, nếu không được thông báo trước, dịch vụ gia tăng sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách.
Chính sách phụ thu sử dụng thêm giờ
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu.
Cứ mỗi 03 (ba) tiếng thêm giờ phát sinh được xác định là 01 (một) khung thêm giờ (Block). Thời gian thêm giờ phát sinh dưới 3 (ba) tiếng được tính tròn là 01 (một) Block.
Đơn giá thêm giờ là: 50% phí dịch vụ /khách/ block (thêm giờ).
Hành khách tự thanh toán chi phí thêm giờ trực tiếp tại quầy lễ tân theo giá công bố tại phòng khách.
Quy trình sử dụng dịch vụ
Bước 1: Khách hàng Xuất trình xuất trình mã ưu đãi/ mã QR trên ứng dụng LifeLink/ hoặc email/ hoặc Zalo cùng Thẻ lên tàu bay tại quầy lễ tân Phòng khách.
Bước 2: Nhân viên Phòng khách xác thực mã QR trên hệ thống.
Trường hợp 1: Xác thực không thành công: Nhân viên Lễ tân Phòng khách từ chối phục vụ khách đồng thời Nhờ khách hàng liên hệ lại Hotline LifeLink 1900 2065 để được hỗ trợ nhanh chóng.
Trường hợp 2: Xác thực thành công: Nhân viên Lễ tân Phòng khách hoàn tất trên hệ thống.
Bước 3: Nhân viên Lễ tân Phòng khách mời Hành khách sử dụng Dịch vụ Phòng chờ Thương gia.
Điều kiện lưu ý bắt buộc
Các trường hợp phát sinh không thông báo trước như: Có vé trẻ em đi kèm,... sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách, LifeLink hoàn toàn không chịu trách nhiệm.
Thời gian thông báo tối thiểu trước 1 ngày sử dụng dịch vụ
Hotline hỗ trợ tư vấn (9h-20h): 1900 2065
Điều kiện khác
Áp dụng 01 E-Voucher/E-Coupon cho 01 khách
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Mã ưu đãi được xuất ra sẽ không được đổi trả dưới mọi hình thức.
Giá trên đã bao gồm phí phục vụ và thuế GTGT',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-SH-Premium-Lounge-Phu-Quoc-2_24062026143849.jpg?sign=TKkyj1wtU3fUbln772Hq-g',
        0,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        'a34f152c-d082-41ec-9f80-c1517563866e',
        'SH Premium Lounge Da Nang tại Sân bay quốc tế Đà Nẵng - Vé trẻ em',
        'Sảnh chờ sang trọng, thiết kế hiện đại với tông nâu gỗ ấm cùng điểm nhấn tranh lớn về Cầu Vàng, Cầu Rồng.
Buffet đa dạng: từ món ăn nhẹ, trái cây tươi đến đặc sản miền Trung như mì Quảng, bánh bèo, bánh bột lọc hấp dẫn.
Ghế bọc da êm ái, mang đến trải nghiệm thư giãn tuyệt đối cho khách trong thời gian chờ bay.
Khu thay đồ riêng dành cho trẻ nhỏ, cực kỳ thuận tiện cho các gia đình di chuyển cùng trẻ em.
Khu máy tính với internet tốc độ cao, đáp ứng nhu cầu làm việc hoặc lướt web khi di chuyển.
Khu hút thuốc biệt lập đảm bảo không khí trong lành cho không gian chung của phòng chờ.
Đội ngũ nhân viên chuyên nghiệp, nhiệt tình luôn hỗ trợ tận tâm từng chi tiết nhỏ để mỗi hành khách thật thư thái.
Ưu đãi đặt SH Premium Lounge Da Nang nhanh chóng, dễ dàng trên LifeLink – trải nghiệm đẳng cấp với chi phí tối ưu.',
        450000.00,
        427500.00,
        'Voucher bao gồm:
Mã ưu đãi 1 lượt sử dụng dịch vụ phòng chờ SH Premium Lounge Da Nang tại Sân bay quốc tế Đà Nẵng - Vé trẻ em
Thời gian sử dụng tại Phòng khách là tối đa 02 giờ trước giờ khởi hành ban đầu
Địa điểm áp dụng: Tầng 4, Ga T1, Cảng HKQT Đà Nẵng (Đối diện cửa ra tàu bay số 6)
Vị trí: Ga đi Quốc nội - Sân Bay Đà Nẵng - Đà Nẵng
Khách hàng được sử dụng mọi dịch vụ tại phòng chờ theo quy định của phòng chờ.
Mã ưu đãi chỉ có giá trị sử dụng một lần. Không chấp nhận Voucher ưu đãi quá hạn sử dụng hoặc trạng thái “Đã sử dụng”.
Vui lòng xuất trình mã ưu đãi cho nhân viên tại quầy để được áp dụng ưu đãi. Khách hàng có thể được yêu cầu trả thêm tiền nếu sử dụng quá giá trị của Mã ưu đãi.
Lưu ý:
Khách hàng sẽ thanh toán trực tiếp tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại mỗi phòng chờ khi:
Khách hàng sử dụng quá thời gian quy định của phòng chờ.
Khách hàng có phát sinh các dịch vụ khác thêm tại phòng chờ
Khách hàng có trẻ em đi kèm mà chưa đăng ký dịch vụ trước qua LifeLink 1900 2065. Thời gian thông báo tối thiểu với LifeLink trước 1 ngày sử dụng dịch vụ LifeLink hoàn toàn không chịu trách nhiệm khi có các phát sinh thêm bên trên.
Khách hàng áp dụng: Khách từ 5 đến 12 tuổi
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng: 04:00 - 00:00
Số lượng E-Voucher áp dụng:
01 voucher/khách/1 lượt sử dụng
Áp dụng nhiều voucher trên 1 hóa đơn
Dịch vụ bao gồm: Các dịch vụ theo tiêu chuẩn tại phòng chờ
Dịch vụ không bao gồm: Chi phí cá nhân và các chi phí phát sinh khác
Chính sách phụ thu trẻ em:
Tối đa một trẻ em dưới 2 tuổi đi cùng với khách hàng người lớn sử dụng dịch vụ được vào phòng khách miễn phí.
Trẻ em từ 2 tuổi trở lên áp dụng đơn giá người lớn.
Đối với trẻ thứ hai trở lên, không phụ thuộc vào độ tuổi, áp dụng mức giá bằng mức giá dành cho người lớn.
Các trường hợp người đi kèm, nếu không được thông báo trước, dịch vụ gia tăng sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách.
Chính sách phụ thu sử dụng thêm giờ
Thời gian sử dụng tại Phòng khách là tối đa 2 giờ trước giờ khởi hành ban đầu.
Trong vòng 02 giờ đầu phục vụ thêm, phụ thu thêm 50% Đơn giá;
Từ giờ thứ 03 trở đi, phụ thu thêm 100% Đơn giá/ giờ.
Hành khách tự thanh toán chi phí thêm giờ trực tiếp tại quầy lễ tân theo giá công bố tại phòng khách.
Quy trình sử dụng dịch vụ:
Bước 1: Khách hàng Xuất trình xuất trình mã ưu đãi/ mã QR trên ứng dụng LifeLink/ hoặc email/ hoặc Zalo cùng Thẻ lên tàu bay tại quầy lễ tân Phòng khách.
Bước 2: Nhân viên Phòng khách xác thực mã QR trên hệ thống.
Trường hợp 1: Xác thực không thành công: Nhân viên Lễ tân Phòng khách từ chối phục vụ khách đồng thời Nhờ khách hàng liên hệ lại Hotline LifeLink 1900 2065 để được hỗ trợ nhanh chóng.
Trường hợp 2: Xác thực thành công: Nhân viên Lễ tân Phòng khách hoàn tất trên hệ thống.
Bước 3: Nhân viên Lễ tân Phòng khách mời Hành khách sử dụng Dịch vụ Phòng chờ Thương gia.
Điều kiện lưu ý bắt buộc
Các trường hợp phát sinh không thông báo trước như: Có vé trẻ em đi kèm,... sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách, LifeLink hoàn toàn không chịu trách nhiệm.
Thời gian thông báo tối thiểu trước 1 ngày sử dụng dịch vụ
Hotline hỗ trợ tư vấn (9h-20h): 1900 2065"
Điều kiện khác
Áp dụng 01 E-Voucher/E-Coupon cho 01 khách
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Mã ưu đãi được xuất ra sẽ không được đổi trả dưới mọi hình thức.
Giá trên đã bao gồm phí phục vụ và thuế GTGT"',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/SH-Premium-Lounge-Da-Nang-1_22062026140825.jpg?sign=JRxz-CkS7eLz4aPJvVYRig',
        0,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        'daf2341c-dcdf-4ed6-9423-680141a66b6d',
        'SH Premium Lounge Lien Khuong tại Sân bay Quốc tế Liên Khương - Vé người lớn',
        'Không gian được thiết kế như khu vườn Mimosa thu nhỏ, hòa quyện sắc vàng ấm và xanh tươi mát.
Ghế ngồi rộng rãi, êm ái cùng không gian mở giúp thư giãn tuyệt đối trước mỗi hành trình.
Đội ngũ nhân viên chuyên nghiệp, tận tâm phục vụ, đáp ứng mọi nhu cầu hành khách nhanh chóng.
Thực đơn đa dạng kết hợp đặc sản địa phương với các món Âu Á, trải nghiệm ẩm thực hấp dẫn.
Tiện ích đẳng cấp gồm quầy bar sang trọng, phòng hút thuốc riêng biệt, khu vực làm việc yên tĩnh, hiện đại.
Khách được tận hưởng không gian riêng tư, sạch sẽ, đẳng cấp giữa sân bay Liên Khương.
Phù hợp cho khách doanh nhân, nhóm bạn hoặc gia đình nghỉ ngơi trước chuyến bay.
Đặt dịch vụ SH Premium Lounge Lien Khuong ngay trên LifeLink để nhận nhiều ưu đãi hấp dẫn, xác nhận nhanh chóng!',
        400000.00,
        380000.00,
        'Voucher bao gồm:
Mã ưu đãi 1 lượt sử dụng dịch vụ phòng chờ SH Premium Lounge Lien Khuong tại Sân bay Quốc tế Liên Khương - Vé người lớn
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu
Địa điểm áp dụng: Tầng 2, Gần cửa khởi hành số 1 và 2, Khu cách ly Ga đi Quốc nội, CHK Quốc Tế Liên Khương.
Vị trí: Ga đi Quốc nội - Sân Bay Liên Khương - Đà Lạt
Khách hàng được sử dụng mọi dịch vụ tại phòng chờ theo quy định của phòng chờ.
Mã ưu đãi chỉ có giá trị sử dụng một lần. Không chấp nhận Voucher ưu đãi quá hạn sử dụng hoặc trạng thái “Đã sử dụng”.
Vui lòng xuất trình mã ưu đãi cho nhân viên tại quầy để được áp dụng ưu đãi.
Khách hàng có thể được yêu cầu trả thêm tiền nếu sử dụng quá giá trị của Mã ưu đãi.
Lưu ý:
Khách hàng sẽ thanh toán trực tiếp tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại mỗi phòng chờ khi:
Khách hàng sử dụng quá thời gian quy định của phòng chờ.
Khách hàng có phát sinh các dịch vụ khác thêm tại phòng chờ
Khách hàng có trẻ em đi kèm mà chưa đăng ký dịch vụ trước qua LifeLink 1900 2065. Thời gian thông báo tối thiểu với LifeLink trước 1 ngày sử dụng dịch vụ LifeLink hoàn toàn không chịu trách nhiệm khi có các phát sinh thêm bên trên.
Khách hàng áp dụng: Khách trên 12 tuổi
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng:
06:00 - 20:00
Chính sách phụ thu trẻ em:
Miễn phí tối đa cho 02 trẻ em dưới 5 tuổi đi kèm cùng mỗi người lớn sử dụng dịch vụ Phòng khách.
Trẻ em dưới 5 tuổi thứ ba trở đi và Trẻ em từ 5 tuổi đến 12 tuổi mức phí bằng 50% đơn giá niêm yết/trẻ em.
Hành khách trên 12 tuổi được tính như quy định đối với người lớn.
Các trường hợp người đi kèm, nếu không được thông báo trước, dịch vụ gia tăng sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách.
Chính sách phụ thu sử dụng thêm giờ:
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu.
Cứ mỗi 03 (ba) tiếng thêm giờ phát sinh được xác định là 01 (một) khung thêm giờ (Block). Thời gian thêm giờ phát sinh dưới 3 (ba) tiếng được tính tròn là 01 (một) Block.
Đơn giá thêm giờ là: 50% phí dịch vụ /khách/ block (thêm giờ).
Hành khách tự thanh toán chi phí thêm giờ trực tiếp tại quầy lễ tân theo giá công bố tại phòng khách.
Quy trình sử dụng dịch vụ:
Bước 1: Khách hàng Xuất trình xuất trình mã ưu đãi/ mã QR trên ứng dụng LifeLink/ hoặc email/ hoặc Zalo cùng Thẻ lên tàu bay tại quầy lễ tân Phòng khách.
Bước 2: Nhân viên Phòng khách xác thực mã QR trên hệ thống.
Trường hợp 1: Xác thực không thành công: Nhân viên Lễ tân Phòng khách từ chối phục vụ khách đồng thời Nhờ khách hàng liên hệ lại Hotline LifeLink 1900 2065 để được hỗ trợ nhanh chóng.
Trường hợp 2: Xác thực thành công: Nhân viên Lễ tân Phòng khách hoàn tất trên hệ thống.
Bước 3: Nhân viên Lễ tân Phòng khách mời Hành khách sử dụng Dịch vụ Phòng chờ Thương gia.
Điều kiện lưu ý bắt buộc:
Các trường hợp phát sinh không thông báo trước như: Có vé trẻ em đi kèm,... sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách, LifeLink hoàn toàn không chịu trách nhiệm.
Thời gian thông báo tối thiểu trước 1 ngày sử dụng dịch vụ
Hotline hỗ trợ tư vấn (9h-20h): 1900 2065
Điều kiện khác
Áp dụng 01 E-Voucher/E-Coupon cho 01 khách
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Mã ưu đãi được xuất ra sẽ không được đổi trả dưới mọi hình thức.
Giá trên đã bao gồm phí phục vụ và thuế GTGT"',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-SH-Premium-Lounge-Lien-Khuong_22062026083104.jpg?sign=hVlVPW7eu6F-KupbJXALlw',
        0,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        '477cbad4-f4a2-4319-81be-3ef0b3696e44',
        'SH Premium Lounge Ha Noi 1 tại Sân bay Quốc tế Nội Bài - Vé người lớn',
        'Phòng chờ sang trọng, thiết kế lấy cảm hứng từ sông Hồng, cầu Long Biên, làng lụa Vạn Phúc, mang hơi thở Hà Nội xưa.
Ghế ngồi êm ái, không gian riêng tư, wifi tốc độ cao, phục vụ cả khách doanh nhân và khách du lịch.
Được trải nghiệm dịch vụ massage tự động, không gian làm việc yên tĩnh, đảm bảo sự thư giãn tối ưu trước giờ lên đường.
Thực đơn tinh tế với đặc sản Hà Nội: phở bò, bánh cuốn Thanh Trì, bún thang, các món ngày lễ Tết.
Nội thất nghệ thuật với gam màu nâu ấm, hình ảnh đàn sâm cầm nhỏ, cuộn chỉ lụa truyền thống tạo điểm nhấn độc đáo.
Kiến trúc hiện đại kết hợp nét đẹp truyền thống, không gian yên tĩnh giữa sân bay nhộn nhịp.
Hỗ trợ mọi nhu cầu đa dạng, phù hợp với khách cao cấp, công tác hay gia đình du lịch Hà Nội.
Đặt phòng chờ SH Premium Lounge Ha Noi 1 qua LifeLink dễ dàng, giữ chỗ nhanh chóng, ưu đãi hấp dẫn cho trải nghiệm thăng hoa.',
        450000.00,
        427500.00,
        'Voucher bao gồm:
Mã ưu đãi 1 lượt sử dụng dịch vụ phòng chờ SH Premium Lounge Ha Noi 1 tại Sân bay Quốc tế Nội Bài - Vé người lớn
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu
Địa điểm áp dụng: Tầng 3, Khu cách ly Quốc nội, Cảng HKQT Nội Bài (Gần cửa ra tàu bay số 4 và 9)
Vị trí: Ga đi Quốc nội - Sân Bay Nội Bài - Hà Nội
Khách hàng được sử dụng mọi dịch vụ tại phòng chờ theo quy định của phòng chờ.
Mã ưu đãi chỉ có giá trị sử dụng một lần. Không chấp nhận Voucher ưu đãi quá hạn sử dụng hoặc trạng thái “Đã sử dụng”.
Vui lòng xuất trình mã ưu đãi cho nhân viên tại quầy để được áp dụng ưu đãi.
Khách hàng có thể được yêu cầu trả thêm tiền nếu sử dụng quá giá trị của Mã ưu đãi.
Lưu ý:
Khách hàng sẽ thanh toán trực tiếp tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại mỗi phòng chờ khi:
Khách hàng sử dụng quá thời gian quy định của phòng chờ.
Khách hàng có phát sinh các dịch vụ khác thêm tại phòng chờ
Khách hàng có trẻ em đi kèm mà chưa đăng ký dịch vụ trước qua LifeLink 1900 2065. Thời gian thông báo tối thiểu với LifeLink trước 1 ngày sử dụng dịch vụ LifeLink hoàn toàn không chịu trách nhiệm khi có các phát sinh thêm bên trên."
Khách hàng áp dụng: Khách trên 12 tuổi
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng: 06:00 - 02:00 (ngày hôm sau) 04:30 - 23:00
Số lượng E-Voucher áp dụng:
01 voucher/khách/1 lượt sử dụng
Áp dụng nhiều voucher trên 1 hóa đơn
Dịch vụ bao gồm: Các dịch vụ theo tiêu chuẩn tại phòng chờ
Dịch vụ không bao gồm: Chi phí cá nhân và các chi phí phát sinh khác
Chính sách phụ thu trẻ em:
Miễn phí tối đa cho 02 trẻ em dưới 5 tuổi đi kèm cùng mỗi người lớn sử dụng dịch vụ Phòng khách.
Trẻ em dưới 5 tuổi thứ ba trở đi và Trẻ em từ 5 tuổi đến 12 tuổi mức phí bằng 50% đơn giá niêm yết/trẻ em.
Hành khách trên 12 tuổi được tính như quy định đối với người lớn.
Các trường hợp người đi kèm, nếu không được thông báo trước, dịch vụ gia tăng sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách.
Chính sách phụ thu sử dụng thêm giờ:
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu.
Cứ mỗi 03 (ba) tiếng thêm giờ phát sinh được xác định là 01 (một) khung thêm giờ (Block). Thời gian thêm giờ phát sinh dưới 3 (ba) tiếng được tính tròn là 01 (một) Block.
Đơn giá thêm giờ là: 50% phí dịch vụ /khách/ block (thêm giờ).
Hành khách tự thanh toán chi phí thêm giờ trực tiếp tại quầy lễ tân theo giá công bố tại phòng khách.
Quy trình sử dụng dịch vụ:
Bước 1: Khách hàng Xuất trình xuất trình mã ưu đãi/ mã QR trên ứng dụng LifeLink/ hoặc email/ hoặc Zalo cùng Thẻ lên tàu bay tại quầy lễ tân Phòng khách.
Bước 2: Nhân viên Phòng khách xác thực mã QR trên hệ thống.
Trường hợp 1: Xác thực không thành công: Nhân viên Lễ tân Phòng khách từ chối phục vụ khách đồng thời Nhờ khách hàng liên hệ lại Hotline LifeLink 1900 2065 để được hỗ trợ nhanh chóng.
Trường hợp 2: Xác thực thành công: Nhân viên Lễ tân Phòng khách hoàn tất trên hệ thống.
Bước 3: Nhân viên Lễ tân Phòng khách mời Hành khách sử dụng Dịch vụ Phòng chờ Thương gia.
Điều kiện lưu ý bắt buộc:
Các trường hợp phát sinh không thông báo trước như: Có vé trẻ em đi kèm,... sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách, LifeLink hoàn toàn không chịu trách nhiệm.
Thời gian thông báo tối thiểu trước 1 ngày sử dụng dịch vụ
Hotline hỗ trợ tư vấn (9h-20h): 1900 2065
Điều kiện khác:
Áp dụng 01 E-Voucher/E-Coupon cho 01 khách
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Mã ưu đãi được xuất ra sẽ không được đổi trả dưới mọi hình thức.
Giá trên đã bao gồm phí phục vụ và thuế GTGT"',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-SH-Premium-Lounge-Ha-Noi-1-1_22062026101117.jpg?sign=8Qd_89lG_IIAvrzoGttraA',
        0,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        '8cd00220-82f0-4099-8d85-329ac748ae31',
        'SH Premium Lounge Tuy Hoa tại Sân bay Tuy Hòa - Vé trẻ em',
        'Voucher áp dụng cho "SH Premium Lounge Tuy Hoa tại Sân bay Tuy Hòa - Vé trẻ em"
mang đến cho quý khách một không gian yên tĩnh, cùng dịch vụ đẳng cấp.
Phòng chờ thương gia Tuy Hoà Business Lounge sở hữu không gian kiến trúc hiện đại, có bố cục và nội thất được thiết kế tỉ mỉ, mang dấu ấn riêng biệt, cùng dịch vụ định hướng 5 sao.
Phòng chờ được chia thành nhiều khu vực chức năng như: chỗ nghỉ ngơi, quầy bar/ buffet, phòng hút thuốc... luôn đáp ứng một các tốt nhất nhu cầu đa dạng của hành khách.
Đặc biệt, menu đa dạng, chế biến khéo léo và bày trí đẹp mắt từ các món đặc sản địa phương đến những món khai vị/ đồ uống/ đồ tráng miệng Á - Âu đặc sắc.
Với đội ngũ nhân viên chuyên nghiệp, chu đáo, nhiệt tình cùng phong cách phục vụ cởi mở, chân thành, hiếu khách, Phòng chờ thương gia Tuy Hoà Business Lounge hứa hẹn làm hài lòng mọi quý khách hàng.',
        200000.00,
        190000.00,
        'Voucher bao gồm:
Mã ưu đãi 1 lượt sử dụng dịch vụ phòng chờ SH Premium Lounge Tuy Hoa tại Sân bay Tuy Hòa - Vé trẻ em
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu
Địa điểm áp dụng: Tầng 1, Khu cách ly Quốc nội, Cảng HK Tuy Hoà (gần cửa ra máy bay ưu tiên)
Vị trí: Ga đi Quốc nội - Sân Bay Tuy Hòa - Tuy Hoà
Khách hàng được sử dụng mọi dịch vụ tại phòng chờ theo quy định của phòng chờ.
Mã ưu đãi chỉ có giá trị sử dụng một lần. Không chấp nhận Voucher ưu đãi quá hạn sử dụng hoặc trạng thái “Đã sử dụng”.
Vui lòng xuất trình mã ưu đãi cho nhân viên tại quầy để được áp dụng ưu đãi.
Khách hàng có thể được yêu cầu trả thêm tiền nếu sử dụng quá giá trị của Mã ưu đãi.
Lưu ý:
Khách hàng sẽ thanh toán trực tiếp tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại mỗi phòng chờ khi:
Khách hàng sử dụng quá thời gian quy định của phòng chờ.
Khách hàng có phát sinh các dịch vụ khác thêm tại phòng chờ
Khách hàng có trẻ em đi kèm mà chưa đăng ký dịch vụ trước qua LifeLink 1900 2065. Thời gian thông báo tối thiểu với LifeLink trước 1 ngày sử dụng dịch vụ LifeLink hoàn toàn không chịu trách nhiệm khi có các phát sinh thêm bên trên."
Khách hàng áp dụng: Khách từ 5 đến 12 tuổi
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng: 5.30 - 16.00
Số lượng E-Voucher áp dụng:
01 voucher/khách/1 lượt sử dụng
Áp dụng nhiều voucher trên 1 hóa đơn"
Dịch vụ bao gồm: Các dịch vụ theo tiêu chuẩn tại phòng chờ
Dịch vụ không bao gồm: Chi phí cá nhân và các chi phí phát sinh khác
Chính sách phụ thu trẻ em
Miễn phí tối đa cho 02 trẻ em dưới 5 tuổi đi kèm cùng mỗi người lớn sử dụng dịch vụ Phòng khách.
Trẻ em dưới 5 tuổi thứ ba trở đi và Trẻ em từ 5 tuổi đến 12 tuổi mức phí bằng 50% đơn giá niêm yết/trẻ em.
Hành khách trên 12 tuổi được tính như quy định đối với người lớn.
Các trường hợp người đi kèm, nếu không được thông báo trước, dịch vụ gia tăng sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách.
Chính sách phụ thu sử dụng thêm giờ
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu.
Cứ mỗi 03 (ba) tiếng thêm giờ phát sinh được xác định là 01 (một) khung thêm giờ (Block). Thời gian thêm giờ phát sinh dưới 3 (ba) tiếng được tính tròn là 01 (một) Block.
Đơn giá thêm giờ là: 50% phí dịch vụ /khách/ block (thêm giờ).
Hành khách tự thanh toán chi phí thêm giờ trực tiếp tại quầy lễ tân theo giá công bố tại phòng khách."
Quy trình sử dụng dịch vụ
Bước 1: Khách hàng Xuất trình xuất trình mã ưu đãi/ mã QR trên ứng dụng LifeLink/ hoặc email/ hoặc Zalo cùng Thẻ lên tàu bay tại quầy lễ tân Phòng khách.
Bước 2: Nhân viên Phòng khách xác thực mã QR trên hệ thống.
Trường hợp 1: Xác thực không thành công: Nhân viên Lễ tân Phòng khách từ chối phục vụ khách đồng thời Nhờ khách hàng liên hệ lại Hotline LifeLink 1900 2065 để được hỗ trợ nhanh chóng.
Trường hợp 2: Xác thực thành công: Nhân viên Lễ tân Phòng khách hoàn tất trên hệ thống.
Bước 3: Nhân viên Lễ tân Phòng khách mời Hành khách sử dụng Dịch vụ Phòng chờ Thương gia.
Điều kiện lưu ý bắt buộc
Các trường hợp phát sinh không thông báo trước như: Có vé trẻ em đi kèm,... sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách, LifeLink hoàn toàn không chịu trách nhiệm.
Thời gian thông báo tối thiểu trước 1 ngày sử dụng dịch vụ
Hotline hỗ trợ tư vấn (9h-20h): 1900 2065
Điều kiện khác
Áp dụng 01 E-Voucher/E-Coupon cho 01 khách
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Mã ưu đãi được xuất ra sẽ không được đổi trả dưới mọi hình thức.
Giá trên đã bao gồm phí phục vụ và thuế GTGT',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/2_14052026090612.jpg?sign=CIUZsaoFI88cnu7Y-0HpMg',
        0,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        'be44b7d9-26ad-46cc-a4fe-c9f79e833e08',
        'E-Coupon ưu đãi giảm 100K cho đơn hàng từ 500K tại Potico.vn - Hoa & Quà Tặng',
        'Potico.vn - Hoa & Quà Tặng
chuyên cung cấp các dịch vụ hoa như hoa cưới, hoa bó, hoa giỏ, hoa văn phòng... với đủ sắc hương và những mẫu gói hoa nghệ thuật đẹp nhất.
Ngoài ra, Potico còn cung cấp các sản phẩm quà tặng khác như nến thơm, bộ quà tặng thiên nhiên, gấu bông, hoa sáp,.... nhằm đem đến cho khách hàng nhiều lựa chọn.
Potico.vn - Hoa & Quà Tặng
là thương hiệu điện hoa hàng đầu Việt Nam được chuyển đổi từ thương hiệu FlowerStore.vn với mong muốn đem đến trải nghiệm tốt hơn cho khách hàng.
Đội ngũ nhân viên chuyên nghiệp và tận tình, từ việc tư vấn cho đến việc chăm sóc khách hàng,
Potico.vn - Hoa & Quà Tặng
luôn cam kết mang đến dịch vụ tốt nhất để đáp ứng mọi nhu cầu của quý khách hàng.',
        100000.00,
        9000.00,
        'Áp dụng E-Coupon ưu đãi giảm 100K cho đơn hàng từ 500K tại Potico.vn - Hoa & Quà Tặng
Ngày áp dụng: Thứ 2 đến Chủ Nhật
Giờ áp dụng: 8h00 - 20h00
Số lượng E-Coupon áp dụng: Sử dụng 01 E-Coupon/ 01 đơn hàng
E-Coupon áp dụng khi đặt hàng tại website
Potico
hoặc app Potico
Khách hàng có nhu cầu muốn xuất hóa đơn vui lòng liên hệ nhà cung cấp để biết rõ thêm thông tin chi tiết:
Hotline: 1900 633 537 hoặc Hotline LifeLink để được hỗ trợ & phục vụ tốt nhất
Hướng dẫn sử dụng:
Bước 1: Khách hàng chọn sản phẩm mua hàng trực tiếp tại
Potico.vn - Hoa & Quà Tặng
Bước 2: Khách hàng nhập mã E-Coupon vào mục nhập mã khuyến mãi giảm giá để được áp dụng ưu đãi.
Bước 3: Khách hàng điền thông tin liên hệ số điện thoại & địa chỉ nhận hàng trên website.
Bước 4: Hoàn tất đơn hàng online
E-Coupon được áp dụng cho các sản phẩm đang giảm giá trên website, ngoại trừ sản phẩm Flash Sale/Sale Sốc
Giao hàng toàn quốc, phí ship tùy thuộc vào đơn vị app giao hàng. Khách hàng liên hệ nhà cung cấp để biết rõ thông tin phí ship.
Khách hàng có nhu cầu muốn xuất hóa đơn vui lòng liên hệ nhà cung cấp để biết rõ thêm thông tin chi tiết
Không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa
Nếu có thắc mắc, vui lòng liên hệ
Potico.vn - Hoa & Quà Tặng
qua hotline 1900 633537 để được hỗ trợ
Khách hàng chỉ được áp dụng 01 mã E-Coupon trên cùng 01 đơn hàng khi mua online
Khách hàng vui lòng bù thêm chênh lệch phát sinh (nếu có) trực tiếp tại Website
Potico.vn - Hoa & Quà Tặng
Mã E-Coupon xuất ra sẽ không được hoàn hủy hoặc đổi trả dưới mọi hình thức.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/Coupon-giam-100k-cho-don-hang_10062026085836.jpg?sign=m1NqrKCkwBob-Zpybi_RCQ',
        0,
        '40000000-0000-0000-0000-000000000005'
    ),
    (
        'e9a94e52-4b38-4255-b3da-35e376666334',
        'SH Premium Lounge Phu Quoc 1 tại Sân bay quốc tế Phú Quốc - Vé người lớn',
        'Voucher áp dụng cho "SH Premium Lounge Phu Quoc 1 tại Sân bay quốc tế Phú Quốc - Vé người lớn" mang đến cho quý khách hàng những giây phút nghỉ ngơi, thư giãn tuyệt vời chuẩn bị cho hành trình bay.
Phòng chờ thương gia Hoa Sim Business Lounge sở hữu phong cách kiến trúc hiện đại, kết hợp đặc trưng của vùng Đảo Ngọc.
Phòng chờ được chia thành nhiều khu vực chức năng như: chỗ nghỉ ngơi, quầy bar/ buffet, phòng hút thuốc... luôn đáp ứng một các tốt nhất nhu cầu đa dạng của hành khách.
Đặc biệt, menu đa dạng, chế biến khéo léo và bày trí đẹp mắt từ các món ăn đặc sản truyền thống của Phú Quốc như: bún quậy, nước sim... đến những món khai vị/ đồ uống/ đồ tráng miệng đặc sắc.
Với đội ngũ nhân viên chuyên nghiệp, chu đáo, nhiệt tình cùng phong cách phục vụ cởi mở, chân thành, hiếu khách, Phòng chờ thương gia Hoa Sim Business Lounge hứa hẹn làm hài lòng mọi quý khách hàng.',
        450000.00,
        427500.00,
        'Voucher bao gồm:
Mã ưu đãi 1 lượt sử dụng dịch vụ phòng chờ
SH Premium Lounge Phu Quoc 1 tại Sân bay quốc tế Phú Quốc - Vé người lớn
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu
Địa điểm áp dụng: Tầng 2, Khu cách ly Quốc nội, Cảng HKQT Phú Quốc (gân cửa ra tàu bay số 12)
Vị trí: Ga đi Quốc nội - Sân Bay Phú Quốc - Phú Quốc
Khách hàng được sử dụng mọi dịch vụ tại phòng chờ theo quy định của phòng chờ.
Mã ưu đãi chỉ có giá trị sử dụng một lần. Không chấp nhận Voucher ưu đãi quá hạn sử dụng hoặc trạng thái “Đã sử dụng"
Vui lòng xuất trình mã ưu đãi cho nhân viên tại quầy để được áp dụng ưu đãi.
Khách hàng có thể được yêu cầu trả thêm tiền nếu sử dụng quá giá trị của Mã ưu đãi.
Lưu ý:
Khách hàng sẽ thanh toán trực tiếp tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại mỗi phòng chờ khi:
Khách hàng sử dụng quá thời gian quy định của phòng chờ.
Khách hàng có phát sinh các dịch vụ khác thêm tại phòng chờ
Khách hàng có trẻ em đi kèm mà chưa đăng ký dịch vụ trước qua LifeLink 1900 2065. Thời gian thông báo tối thiểu với LifeLink trước 1 ngày sử dụng dịch vụ LifeLink hoàn toàn không chịu trách nhiệm khi có các phát sinh thêm bên trên.
Khách hàng áp dụng: Khách trên 12 tuổi
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng: 05:30 - 23:30
Số lượng E-Voucher áp dụng:
01 voucher/khách/1 lượt sử dụng
Áp dụng nhiều voucher trên 1 hóa đơn
Dịch vụ bao gồm: Các dịch vụ theo tiêu chuẩn tại phòng chờ
Dịch vụ không bao gồm: Chi phí cá nhân và các chi phí phát sinh khác
Chính sách phụ thu trẻ em:
Miễn phí tối đa cho 02 trẻ em dưới 5 tuổi đi kèm cùng mỗi người lớn sử dụng dịch vụ Phòng khách.
Trẻ em dưới 5 tuổi thứ ba trở đi và Trẻ em từ 5 tuổi đến 12 tuổi mức phí bằng 50% đơn giá niêm yết/trẻ em.
Hành khách trên 12 tuổi được tính như quy định đối với người lớn.
Các trường hợp người đi kèm, nếu không được thông báo trước, dịch vụ gia tăng sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách.
Chính sách phụ thu sử dụng thêm giờ:
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu.
Cứ mỗi 03 (ba) tiếng thêm giờ phát sinh được xác định là 01 (một) khung thêm giờ ("Block"). Thời gian thêm giờ phát sinh dưới 3 (ba) tiếng được tính tròn là 01 (một) Block.
Đơn giá thêm giờ là: 50% phí dịch vụ /khách/ block (thêm giờ).
Hành khách tự thanh toán chi phí thêm giờ trực tiếp tại quầy lễ tân theo giá công bố tại phòng khách.
Quy trình sử dụng dịch vụ
Bước 1: Khách hàng Xuất trình xuất trình mã ưu đãi/ mã QR trên ứng dụng LifeLink/ hoặc email/ hoặc Zalo cùng Thẻ lên tàu bay tại quầy lễ tân Phòng khách.
Bước 2: Nhân viên Phòng khách xác thực mã QR trên hệ thống.
Trường hợp 1: Xác thực không thành công: Nhân viên Lễ tân Phòng khách từ chối phục vụ khách đồng thời Nhờ khách hàng liên hệ lại Hotline LifeLink 1900 2065 để được hỗ trợ nhanh chóng.
Trường hợp 2: Xác thực thành công: Nhân viên Lễ tân Phòng khách hoàn tất trên hệ thống.
Bước 3: Nhân viên Lễ tân Phòng khách mời Hành khách sử dụng Dịch vụ Phòng chờ Thương gia.
Điều kiện lưu ý bắt buộc
Các trường hợp phát sinh không thông báo trước như: Có vé trẻ em đi kèm,... sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách, LifeLink hoàn toàn không chịu trách nhiệm.
Thời gian thông báo tối thiểu trước 1 ngày sử dụng dịch vụ
Hotline hỗ trợ tư vấn (9h00-20h00): 1900 2065
Điều kiện khác
Áp dụng 01 E-Voucher/E-Coupon cho 01 khách
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Mã ưu đãi được xuất ra sẽ không được đổi trả dưới mọi hình thức.
Giá trên đã bao gồm phí phục vụ và thuế GTGT',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/2_13052026154011.jpg?sign=yl_PORfk7hPmJysZNxBLsQ',
        0,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        'dbe3bd91-a779-44ce-8b37-818feef0f382',
        'Le Saigonnais Lounge Tan Son Nhat tại Sân bay Quốc tế Tân Sơn Nhất - Vé người lớn',
        'Le Saigonnais là phòng chờ hạng thương gia mang bản sắc văn hóa Sài Gòn, được thiết kế với phong cách cổ điển, tinh tế kết hợp hài hòa kiến trúc Sài gòn xưa cùng đường nét trang trí hiện đại.
Không gian phòng chờ được thiết kế phân cách bằng mảng xanh, khu vườn yên tĩnh, cửa gỗ đan mây, đủ khéo léo để tôn trọng tính riêng tư cho người sử dụng mà vẫn thuận lợi kết nối với kiến trúc tổng thể.
Tại Le Saigonnais, khu ẩm thực là điểm nhấn mang đậm dấu ấn Sài Gòn với sự hiện diện của những món đặc trưng như các món ăn sáng Sài Gòn, các món nước, món ăn vặt… sẽ làm hài lòng các khách hàng yêu thích khám phá ẩm thực địa phương.
Tính cách “Người Sài Gòn” của Le Saigonnais – chân thành, cởi mở, tinh tế và hiện đại – được toát lên không chỉ ở kiến trúc, không gian, cách bài trí, mà còn từ phong thái của từng con người nơi đây qua cung cách phục vụ, chăm sóc hành khách tin tưởng đến với dịch vụ Phòng chờ tại nơi đây.',
        490000.00,
        465500.00,
        'Voucher bao gồm:
Mã ưu đãi 1 lượt sử dụng dịch vụ phòng chờ Le Saigonnais Lounge Tan Son Nhat tại Sân bay Quốc tế Tân Sơn Nhất - Vé người lớn
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu
Địa điểm áp dụng: Tầng 4, Khu cách ly Quốc nội, Nhà ga T3, Cảng HKQT Tân Sơn Nhất
Vị trí: Ga đi Quốc nội - Sân Bay Tân Sơn Nhất - TP Hồ Chí Minh
Khách hàng được sử dụng mọi dịch vụ tại phòng chờ theo quy định của phòng chờ.
Mã ưu đãi chỉ có giá trị sử dụng một lần. Không chấp nhận Voucher ưu đãi quá hạn sử dụng hoặc trạng thái “Đã sử dụng”.
Vui lòng xuất trình mã ưu đãi cho nhân viên tại quầy để được áp dụng ưu đãi.
Khách hàng có thể được yêu cầu trả thêm tiền nếu sử dụng quá giá trị của Mã ưu đãi.
Lưu ý:
Khách hàng sẽ thanh toán trực tiếp tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại mỗi phòng chờ khi:
Khách hàng sử dụng quá thời gian quy định của phòng chờ.
Khách hàng có phát sinh các dịch vụ khác thêm tại phòng chờ
Khách hàng có trẻ em đi kèm mà chưa đăng ký dịch vụ trước qua LifeLink 1900 2065. Thời gian thông báo tối thiểu với LifeLink trước 1 ngày sử dụng dịch vụ LifeLink hoàn toàn không chịu trách nhiệm khi có các phát sinh thêm bên trên.
Khách hàng áp dụng: Khách trên 12 tuổi
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng: 04:00 - 00:00
Số lượng E-Voucher áp dụng:
01 voucher/khách/1 lượt sử dụng
Áp dụng nhiều voucher trên 1 hóa đơn
Dịch vụ bao gồm: Các dịch vụ theo tiêu chuẩn tại phòng chờ
Dịch vụ không bao gồm: Chi phí cá nhân và các chi phí phát sinh khác
Chính sách phụ thu trẻ em:
Mỗi khách người lớn được miễn phí tối đa 01 trẻ em dưới 5 tuổi.
Từ trẻ em dưới 5 tuổi thứ 2: Áp dụng Đơn giá trẻ em.
Khách từ 5 đến 12 tuổi: Áp dụng Đơn giá trẻ em.
Khách trên 12 tuổi: Áp dụng Đơn giá người lớn.
Các trường hợp người đi kèm, nếu không được thông báo trước, dịch vụ gia tăng sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách.
Chính sách phụ thu sử dụng thêm giờ:
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu.
Cứ mỗi 03 (ba) tiếng thêm giờ phát sinh được xác định là 01 (một) khung thêm giờ (Block). Thời gian thêm giờ phát sinh dưới 3 (ba) tiếng được tính tròn là 01 (một) Block.
Đơn giá thêm giờ là: 50% phí dịch vụ /khách/ block (thêm giờ).
Hành khách tự thanh toán chi phí thêm giờ trực tiếp tại quầy lễ tân theo giá công bố tại phòng khách.
Quy trình sử dụng dịch vụ:
Bước 1: Khách hàng Xuất trình xuất trình mã ưu đãi/ mã QR trên ứng dụng LifeLink/ hoặc email/ hoặc Zalo cùng Thẻ lên tàu bay tại quầy lễ tân Phòng khách.
Bước 2: Nhân viên Phòng khách xác thực mã QR trên hệ thống.
Trường hợp 1: Xác thực không thành công: Nhân viên Lễ tân Phòng khách từ chối phục vụ khách đồng thời Nhờ khách hàng liên hệ lại Hotline LifeLink 1900 2065 để được hỗ trợ nhanh chóng.
Trường hợp 2: Xác thực thành công: Nhân viên Lễ tân Phòng khách hoàn tất trên hệ thống.
Bước 3: Nhân viên Lễ tân Phòng khách mời Hành khách sử dụng Dịch vụ Phòng chờ Thương gia."
Điều kiện lưu ý bắt buộc:
Các trường hợp phát sinh không thông báo trước như: Có vé trẻ em đi kèm,... sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách, LifeLink hoàn toàn không chịu trách nhiệm.
Thời gian thông báo tối thiểu trước 1 ngày sử dụng dịch vụ
Hotline hỗ trợ tư vấn (9h-20h): 1900 2065
Điều kiện khác
Áp dụng 01 E-Voucher/E-Coupon cho 01 khách
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Mã ưu đãi được xuất ra sẽ không được đổi trả dưới mọi hình thức.
Giá trên đã bao gồm phí phục vụ và thuế GTGT',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/2_13052026140507.jpg?sign=H-JauPXY_IWm3WkwwlznGg',
        0,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        'af6ee141-6164-4732-964b-c7fe68cf97d1',
        'SH Premium Lounge Phu Cat tại Sân bay Phù Cát - Vé người lớn',
        'Voucher áp dụng cho "SH Premium Lounge Phu Cat tại Sân bay Phù Cát - Vé người lớn" mang đến cho quý khách hàng những trải nghiệm tuyệt vời trước chuyến bay.
Phòng chờ
SH Premium Lounge Phu Cat
sở hữu không gian kiến trúc hiện đại, có bố cục và nội thất được thiết kế tỉ mỉ, mang dấu ấn riêng biệt, cùng dịch vụ định hướng 5 sao.
Phòng chờ được chia thành nhiều khu vực chức năng như: chỗ nghỉ ngơi, quầy bar/ buffet, phòng hút thuốc... luôn đáp ứng một các tốt nhất nhu cầu đa dạng của hành khách.
Đặc biệt, menu đa dạng, chế biến khéo léo và bày trí đẹp mắt từ các món đặc sản Bình Định đến những món khai vị/ đồ uống/ đồ tráng miệng đặc sắc.
Với đội ngũ nhân viên chuyên nghiệp, chu đáo, nhiệt tình cùng phong cách phục vụ cởi mở, chân thành, hiếu khách, Phòng chờ
SH Premium Lounge Phu Cat
hứa hẹn làm hài lòng mọi quý khách hàng.',
        400000.00,
        380000.00,
        'Voucher bao gồm:
Mã ưu đãi 1 lượt sử dụng dịch vụ phòng chờ SH Premium Lounge Phu Cat tại Sân bay Phù Cát - Vé người lớn
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu
Địa điểm áp dụng: Tầng 2, Khu cách ly Quốc nội, Cảng HK Phù Cát (phòng khách nằm đối diện với thang máy)
Vị trí: Ga đi Quốc nội - Sân bay Phù Cát - Quy Nhơn
Khách hàng được sử dụng mọi dịch vụ tại phòng chờ theo quy định của phòng chờ.
Mã ưu đãi chỉ có giá trị sử dụng một lần. Không chấp nhận Voucher ưu đãi quá hạn sử dụng hoặc trạng thái “Đã sử dụng”.
Vui lòng xuất trình mã ưu đãi cho nhân viên tại quầy để được áp dụng ưu đãi.
Khách hàng có thể được yêu cầu trả thêm tiền nếu sử dụng quá giá trị của Mã ưu đãi.
Lưu ý:
Khách hàng sẽ thanh toán trực tiếp tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại mỗi phòng chờ khi:
Khách hàng sử dụng quá thời gian quy định của phòng chờ.
Khách hàng có phát sinh các dịch vụ khác thêm tại phòng chờ
Khách hàng có trẻ em đi kèm mà chưa đăng ký dịch vụ trước qua LifeLink 1900 2065. Thời gian thông báo tối thiểu với LifeLink trước 1 ngày sử dụng dịch vụ LifeLink hoàn toàn không chịu trách nhiệm khi có các phát sinh thêm bên trên.
Khách hàng áp dụng: Khách trên 12 tuổi
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng: 06:00 - 20:20
Số lượng E-Voucher áp dụng:
01 voucher/khách/1 lượt sử dụng
Áp dụng nhiều voucher trên 1 hóa đơn
Dịch vụ bao gồm: Các dịch vụ theo tiêu chuẩn tại phòng chờ
Dịch vụ không bao gồm: Chi phí cá nhân và các chi phí phát sinh khác
Chính sách phụ thu trẻ em:
Miễn phí tối đa cho 02 trẻ em dưới 5 tuổi đi kèm cùng mỗi người lớn sử dụng dịch vụ Phòng khách.
Trẻ em dưới 5 tuổi thứ ba trở đi và Trẻ em từ 5 tuổi đến 12 tuổi mức phí bằng 50% đơn giá niêm yết/trẻ em.
Hành khách trên 12 tuổi được tính như quy định đối với người lớn.
Các trường hợp người đi kèm, nếu không được thông báo trước, dịch vụ gia tăng sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách.
Chính sách phụ thu sử dụng thêm giờ
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu.
Cứ mỗi 03 (ba) tiếng thêm giờ phát sinh được xác định là 01 (một) khung thêm giờ (Block). Thời gian thêm giờ phát sinh dưới 3 (ba) tiếng được tính tròn là 01 (một) Block.
Đơn giá thêm giờ là: 50% phí dịch vụ /khách/ block (thêm giờ).
Hành khách tự thanh toán chi phí thêm giờ trực tiếp tại quầy lễ tân theo giá công bố tại phòng khách.
Quy trình sử dụng dịch vụ
Bước 1: Khách hàng Xuất trình xuất trình mã ưu đãi/ mã QR trên ứng dụng LifeLink/ hoặc email/ hoặc Zalo cùng Thẻ lên tàu bay tại quầy lễ tân Phòng khách.
Bước 2: Nhân viên Phòng khách xác thực mã QR trên hệ thống.
Trường hợp 1: Xác thực không thành công: Nhân viên Lễ tân Phòng khách từ chối phục vụ khách đồng thời Nhờ khách hàng liên hệ lại Hotline LifeLink 1900 2065 để được hỗ trợ nhanh chóng.
Trường hợp 2: Xác thực thành công: Nhân viên Lễ tân Phòng khách hoàn tất trên hệ thống.
Bước 3: Nhân viên Lễ tân Phòng khách mời Hành khách sử dụng Dịch vụ Phòng chờ Thương gia.
Điều kiện lưu ý bắt buộc
Các trường hợp phát sinh không thông báo trước như: Có vé trẻ em đi kèm,... sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách, LifeLink hoàn toàn không chịu trách nhiệm.
Thời gian thông báo tối thiểu trước 1 ngày sử dụng dịch vụ
Hotline hỗ trợ tư vấn (9h-20h): 1900 2065
Điều kiện khác
Áp dụng 01 E-Voucher/E-Coupon cho 01 khách
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Mã ưu đãi được xuất ra sẽ không được đổi trả dưới mọi hình thức.
Giá trên đã bao gồm phí phục vụ và thuế GTGT',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/1_13052026161612.jpg?sign=twgDV62nRoq3TNHvRu8Daw',
        0,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        'c4939bd9-5786-4df1-84ba-bde62c747236',
        'SH Premium Lounge Tho Xuan tại Sân bay Thọ Xuân - Vé người lớn',
        'Voucher áp dụng cho "SH Premium Lounge Tho Xuan tại Sân bay Thọ Xuân - Vé người lớn"
giúp quý khách
tận hưởng không gian yên tĩnh, trải nghiệm dịch vụ đẳng cấp và thưởng thức bản sắc văn hóa địa phương Việt Nam.
Phòng chờ SH Premium Lounge Tho Xuan sở hữu không gian kiến trúc hiện đại, có bố cục và nội thất được thiết kế tỉ mỉ, mang dấu ấn riêng biệt, cùng dịch vụ định hướng 5 sao.
Phòng chờ được chia thành nhiều khu vực chức năng như: chỗ nghỉ ngơi, quầy bar/ buffet, phòng hút thuốc... luôn đáp ứng một các tốt nhất nhu cầu đa dạng của hành khách.
Đặc biệt, menu đa dạng, chế biến khéo léo và bày trí đẹp mắt từ các món đặc sản địa phương đến những món khai vị/ đồ uống/ đồ tráng miệng Á - Âu đặc sắc.
Với đội ngũ nhân viên chuyên nghiệp, chu đáo, nhiệt tình cùng phong cách phục vụ cởi mở, chân thành, hiếu khách, Phòng chờ SH Premium Lounge Tho Xuan hứa hẹn làm hài lòng mọi quý khách hàng.',
        400000.00,
        380000.00,
        'Voucher bao gồm:
Mã ưu đãi 1 lượt sử dụng dịch vụ phòng chờ SH Premium Lounge Tho Xuan tại Sân bay Thọ Xuân - Vé người lớn
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu
Địa điểm áp dụng: Tầng 2, Khu cách ly Quốc nội, Cảng HK Thọ Xuân (Gần cửa ra tàu bay số 2)
Vị trí: Ga đi Quốc nội - Sân Bay Thọ Xuân - Thanh Hoá
Khách hàng được sử dụng mọi dịch vụ tại phòng chờ theo quy định của phòng chờ.
Mã ưu đãi chỉ có giá trị sử dụng một lần. Không chấp nhận Voucher ưu đãi quá hạn sử dụng hoặc trạng thái “Đã sử dụng”.
Vui lòng xuất trình mã ưu đãi cho nhân viên tại quầy để được áp dụng ưu đãi.
Khách hàng có thể được yêu cầu trả thêm tiền nếu sử dụng quá giá trị của Mã ưu đãi.
Lưu ý:
Khách hàng sẽ thanh toán trực tiếp tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại mỗi phòng chờ khi:
Khách hàng sử dụng quá thời gian quy định của phòng chờ.
Khách hàng có phát sinh các dịch vụ khác thêm tại phòng chờ
Khách hàng có trẻ em đi kèm mà chưa đăng ký dịch vụ trước qua LifeLink 1900 2065. Thời gian thông báo tối thiểu với LifeLink trước 1 ngày sử dụng dịch vụ LifeLink hoàn toàn không chịu trách nhiệm khi có các phát sinh thêm bên trên.
Khách hàng áp dụng: Khách trên 12 tuổi
Ngày áp dụng: Tất cả các ngày trong tuần, bao gồm Lễ Tết
Giờ áp dụng: 06:30 - 21:30
Số lượng E-Voucher áp dụng:
01 voucher/khách/1 lượt sử dụng
Áp dụng nhiều voucher trên 1 hóa đơn
Dịch vụ bao gồm: Các dịch vụ theo tiêu chuẩn tại phòng chờ
Dịch vụ không bao gồm: Chi phí cá nhân và các chi phí phát sinh khác
Chính sách phụ thu trẻ em:
Miễn phí tối đa cho 02 trẻ em dưới 5 tuổi đi kèm cùng mỗi người lớn sử dụng dịch vụ Phòng khách.
Trẻ em dưới 5 tuổi thứ ba trở đi và Trẻ em từ 5 tuổi đến 12 tuổi mức phí bằng 50% đơn giá niêm yết/trẻ em.
Hành khách trên 12 tuổi được tính như quy định đối với người lớn.
Các trường hợp người đi kèm, nếu không được thông báo trước, dịch vụ gia tăng sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách.
Chính sách phụ thu sử dụng thêm giờ
Thời gian sử dụng tại Phòng khách là tối đa 03 giờ trước giờ khởi hành ban đầu.
Cứ mỗi 03 (ba) tiếng thêm giờ phát sinh được xác định là 01 (một) khung thêm giờ (Block). Thời gian thêm giờ phát sinh dưới 3 (ba) tiếng được tính tròn là 01 (một) Block.
Đơn giá thêm giờ là: 50% phí dịch vụ /khách/ block (thêm giờ).
Hành khách tự thanh toán chi phí thêm giờ trực tiếp tại quầy lễ tân theo giá công bố tại phòng khách.
Quy trình sử dụng dịch vụ
Bước 1: Khách hàng Xuất trình xuất trình mã ưu đãi/ mã QR trên ứng dụng LifeLink/ hoặc email/ hoặc Zalo cùng Thẻ lên tàu bay tại quầy lễ tân Phòng khách.
Bước 2: Nhân viên Phòng khách xác thực mã QR trên hệ thống.
Trường hợp 1: Xác thực không thành công: Nhân viên Lễ tân Phòng khách từ chối phục vụ khách đồng thời Nhờ khách hàng liên hệ lại Hotline LifeLink 1900 2065 để được hỗ trợ nhanh chóng.
Trường hợp 2: Xác thực thành công: Nhân viên Lễ tân Phòng khách hoàn tất trên hệ thống.
Bước 3: Nhân viên Lễ tân Phòng khách mời Hành khách sử dụng Dịch vụ Phòng chờ Thương gia.
Điều kiện lưu ý bắt buộc
Các trường hợp phát sinh không thông báo trước như: Có vé trẻ em đi kèm,... sẽ do Khách hàng tự thanh toán tại quầy lễ tân theo bảng giá công bố cho khách lẻ tại Phòng khách, LifeLink hoàn toàn không chịu trách nhiệm.
Thời gian thông báo tối thiểu trước 1 ngày sử dụng dịch vụ
Hotline hỗ trợ tư vấn (9h-20h): 1900 2065
Điều kiện khác
Áp dụng 01 E-Voucher/E-Coupon cho 01 khách
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác
Mã ưu đãi được xuất ra sẽ không được đổi trả dưới mọi hình thức.
Giá trên đã bao gồm phí phục vụ và thuế GTGT',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/1_14052026091932.jpg?sign=BbYtKahe5EIcHe5iCsRHZQ',
        0,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        '43278c13-6018-46cd-9b7b-e9494e7a7ee9',
        'Phòng chờ thương gia The Champ Lounge tại Ga Quốc nội - Sân bay Quốc tế Cam Ranh - Vé người lớn',
        'Phòng chờ thương gia The Champ Lounge tại Ga Quốc nội - Sân bay Quốc tế Cam Ranh mang đến trải nghiệm thú vị, thư giãn trong không gian riêng tư, yên tĩnh, tách biệt khỏi sự náo nhiệt của sân bay trước mỗi hành trình.
Thiết kế của The Champ Lounge xuất phát từ ý tưởng mang đến cho hành khách không gian phòng chờ tại sân bay vừa đạt các tiêu chuẩn dịch vụ cao cấp vừa mang nét văn hóa độc đáo của địa phương.
Điểm nhấn của The Champ Lounge chính là những nét văn hóa Chăm - văn hóa bản địa cổ xưa ở khu vực Nha Trang, Khánh Hòa – được thể hiện rõ nét từ tên gọi của phòng chờ cho đến trang phục của nhân viên, ẩm thực phục vụ khách hàng,….
Không gian sang trọng và đẳng cấp, khéo léo để tôn trọng tính riêng tư cho người sử dụng mà vẫn thuận lợi kết nối với kiến trúc tổng thể.
Với diện tích rộng rãi The Champ Lounge có khả năng phục vụ tối đa trên 60 khách cùng lúc. Toàn bộ bàn ghế, quầy Lễ tân, khu vực buffet-line đều được trang bị, xây dựng hoàn toàn mới hứa hẹn đem đến trải nghiệm thoải mái, hài lòng nhất cho khách hàng.
Đội ngũ nhân viên phục vụ chu đáo, nhiệt tình, phòng chờ thương gia The Champ Lounge sẽ mang đến cho quý khách hàng sự tin tường và hài lòng nhất.',
        450000.00,
        405000.00,
        'Áp dụng cho Phòng chờ hạng thương gia The Champ Lounge tại Nhà ga quốc nội - Sân bay quốc tế Cam Ranh - Vé Người lớn
Địa điểm cung cấp dịch vụ: Phòng chờ hạng Thương gia The Champ Lounge - nhà ga T1, Cảng hàng không Quốc tế Cam Ranh
Vị trí: Gần cửa ra số 6, Nhà ga quốc nội, Cảng HKQT Cam Ranh
Thời gian phục vụ tiêu chuẩn đối với mỗi lượt hành khách là 180 (một trăm tám mươi) phút trước giờ khởi hành của mỗi chuyến bay
Khách hàng được sử dụng mọi dịch vụ tại phòng chờ theo quy định của phòng chờ.
Mã ưu đãi được xuất ra sẽ không được đổi trả dưới mọi hình thức.
Mã ưu đãi chỉ có giá trị sử dụng một lần. Không chấp nhận Mã ưu đãi quá hạn sử dụng hoặc trạng thái “Đã sử dụng”.
Vui lòng xuất trình Mã ưu đãi cho nhân viên tại quầy trước khi thanh toán để được áp dụng Mã ưu đãi.
Mã ưu đãi sẽ không được hoàn lại tiền thừa và không có giá trị quy đổi thành tiền mặt. Khách hàng có thể được yêu cầu trả thêm tiền nếu sử dụng quá giá trị của Mã ưu đãi.
Khách hàng sẽ thanh toán trực tiếp cho phòng chờ nếu sử dụng quá thời gian của Mã ưu đãi theo giá hiện hành tại mỗi phòng chờ.
Khách hàng áp dụng: Khách hàng từ 13 tuổi trở lên
Ngày áp dụng: Tất cả các ngày
Giờ áp dụng: Mở cửa 4:30 sáng đến chuyến bay cuối
Số lượng E-Voucher áp dụng:
01 voucher/ 1 khách
Áp dụng nhiều voucher trên 1 hóa đơn
Phụ thu:
Chính sách phụ thu người đi kèm:
Trẻ em từ dưới 5 tuổi: Miễn phí 1 trẻ em đi cùng.
Trẻ em dưới 5 tuổi kể từ trẻ thứ 2 tính theo đơn giá trẻ em từ 5 - 12 tuổi.
Trẻ em trên 12 tuổi được tính như quy định đối với người lớn.
Người đi kèm khác tính phí theo giá niêm yết tại Phòng chờ
Khách hàng phải xuất trình passport hoặc boarding pass cho nhân viên tại phòng khách
Chính sách sử dụng thêm giờ:
Từ 1 đến 3 giờ phục vụ thêm (từ lúc hết giờ phục vụ được quy định), tính thêm 50% mức giá.
Từ 3 đến 6 giờ phục vụ thêm (từ lúc hết giờ phục vụ được quy định), thu thêm 100% mức giá.
Các trường hợp Khách đi kèm và sử dụng thêm giờ, Hành khách tự thanh toán trực tiếp tại quầy lễ tân Phòng khách theo giá công bố tại Phòng khách.
Hướng dẫn sử dụng dịch vụ:
Bước 1: Khách hàng Xuất trình xuất trình mã ưu đãi/ mã QR trên ứng dụng LifeLink /hoặc email/ hoặc Zalo cùng Thẻ lên tàu bay (nếu có) tại quầy lễ tân Phòng khách.
Bước 2: Nhân viên Phòng khách xác thực mã QR trên hệ thống
Trường hợp 1: Xác thực không thành công: Nhân viên Lễ tân Phòng khách từ chối phục vụ khách đồng thời Nhờ khách hàng liên hệ lại Hotline LifeLink 1900 2065 để được hỗ trợ nhanh chóng.
Trường hợp 2: Xác thực thành công: Nhân viên Lễ tân Phòng khách hoàn tất trên hệ thống.
Bước 3: Nhân viên Lễ tân Phòng khách mời Hành khách sử dụng Dịch vụ Phòng chờ Thương gia
Thông tin liên hệ:
Điện thoại: 1900 2065
Địa chỉ: Phòng chờ The Champ Lounge - Nhà ga quốc nội, Cảng HKQT Cam Ranh
Giá đã bao gồm VAT, khách lấy hóa đơn vui lòng liên hệ LifeLink
Điều kiện khác
Một khách hàng được mua nhiều E-Voucher/E-Coupon
E-Voucher/E-Coupon không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa.
Không áp dụng đồng thời với chương trình khuyến mại khác',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/the-champ-lounge_13052026112143.jpg?sign=f3355DouEEZWGXgYgLed8w',
        0,
        '40000000-0000-0000-0000-000000000004'
    ),
    (
        'ffae9e53-0aa0-4d5d-9fb0-30243fba35a9',
        'E-Coupon ưu đãi giảm 20% cho tất cả các đơn hàng đặt online tại Potico.vn - Hoa & Quà Tặng',
        'Potico.vn - Hoa & Quà Tặng chuyên cung cấp các dịch vụ hoa như hoa cưới, hoa bó, hoa giỏ, hoa văn phòng... với đủ sắc hương và những mẫu gói hoa nghệ thuật đẹp nhất.
Ngoài ra, Potico.vn - Hoa & Quà Tặng còn cung cấp các sản phẩm quà tặng khác như nến thơm, bộ quà tặng thiên nhiên, gấu bông, hoa sáp,.... nhằm đem đến cho khách hàng nhiều lựa chọn.
Potico.vn là thương hiệu điện hoa hàng đầu Việt Nam được chuyển đổi từ thương hiệu FlowerStore.vn với mong muốn đem đến trải nghiệm tốt hơn cho khách hàng.
Đội ngũ nhân viên chuyên nghiệp và tận tình, từ việc tư vấn cho đến việc chăm sóc khách hàng, Potico.vn - Hoa & Quà Tặng luôn cam kết mang đến dịch vụ tốt nhất để đáp ứng mọi nhu cầu của quý khách hàng.',
        100000.00,
        9000.00,
        'Áp dụng cho E-Coupon ưu đãi giảm 20% tất cả đơn hàng, mức giảm tối đa 120k tại Potico.vn - Hoa & Quà Tặng
Ngày áp dụng: Thứ 2 đến Chủ Nhật
Giờ áp dụng: 8h00 - 20h00
Số lượng E-Coupon áp dụng: Sử dụng 01 E-Coupon/ 01 đơn hàng
E-Coupon áp dụng khi đặt hàng tại website
Potico
hoặc app Potico
Khách hàng có nhu cầu muốn xuất hóa đơn vui lòng liên hệ nhà cung cấp để biết rõ thêm thông tin chi tiết:
Hotline: 1900 633 537 hoặc Hotline LifeLink để được hỗ trợ & phục vụ tốt nhất
Hướng dẫn sử dụng:
Bước 1: Khách hàng chọn sản phẩm mua hàng trực tiếp tại Potico
Bước 2: Khách hàng nhập mã E-Coupon vào mục nhập mã khuyến mãi giảm giá để được áp dụng ưu đãi.
Bước 3: Khách hàng điền thông tin liên hệ số điện thoại & địa chỉ nhận hàng trên website.
Bước 4: Hoàn tất đơn hàng online
E-Coupon được áp dụng cho các sản phẩm đang giảm giá trên website, ngoại trừ sản phẩm Flash Sale/Sale Sốc
Giao hàng toàn quốc, phí ship tùy thuộc vào đơn vị app giao hàng. Khách hàng liên hệ nhà cung cấp để biết rõ thông tin phí ship.
Khách hàng có nhu cầu muốn xuất hóa đơn vui lòng liên hệ nhà cung cấp để biết rõ thêm thông tin chi tiết
Không có giá trị quy đổi thành tiền mặt, không trả lại tiền thừa
Nếu có thắc mắc, vui lòng liên hệ Potico.vn qua hotline 1900 633537 để được hỗ trợ
Khách hàng chỉ được áp dụng 01 mã E-Coupon trên cùng 01 đơn hàng khi mua online
Khách hàng vui lòng bù thêm chênh lệch phát sinh (nếu có) trực tiếp tại Website Potico.vn
Mã E-Coupon xuất ra sẽ không được hoàn hủy hoặc đổi trả dưới mọi hình thức.',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/Coupon-giam-20-pha-tram_10062026084512.jpg?sign=1OFAlCZyC581BzJ_iUfjsg',
        0,
        '40000000-0000-0000-0000-000000000005'
    ),
    (
        '3be64879-c4f7-4d23-8524-fa70a0ba515f',
        'bTaskee - Ứng dụng tiện ích gia đình - Voucher giảm 50% tối đa 50.000 VND nhóm dịch vụ bCleaning',
        'Món quà tinh tế, dành cho người thân yêu chăm sóc không gian sống tiện nghi, sạch sẽ mọi lúc.
Voucher bTaskee linh hoạt, sử dụng cho các dịch vụ vệ sinh đa dạng trong hệ thống ứng dụng.
Nhận mã voucher nhanh chóng, bảo quản dễ dàng, không lo thất lạc, thuận tiện cho cả người gửi lẫn người nhận.
Giá trị ưu đãi giảm 50% tối đa 50.000 VND, tiết kiệm chi phí cho mỗi lần sử dụng dịch vụ vệ sinh gia đình.
Dễ dàng lựa chọn một trong các dịch vụ: Vệ sinh tổng, vệ sinh máy lạnh, sofa nệm rèm hoặc máy giặt theo nhu cầu thực tế.
Chỉ cần thao tác qua ứng dụng bTaskee, thẻ đáp ứng ngay cả các nhu cầu vệ sinh đột xuất trong gia đình.
Là giải pháp quà tặng phù hợp cho các dịp tân gia, sinh nhật, cảm ơn đối tác, đồng nghiệp quan tâm đến môi trường sống sạch.
Sở hữu mã ưu đãi bTaskee giúp trải nghiệm chất lượng dịch vụ tiên phong về công nghệ, tối ưu hóa cuộc sống hiện đại.',
        50000.00,
        9000.00,
        'Ưu đãi giảm 50% tối đa 50.000 VND áp dụng cho nhóm dịch vụ bCleaning gồm 1 trong các dịch vụ:
Tổng Vệ sinh, Vệ sinh máy lạnh, Vệ sinh Sofa Nệm Rèm, Vệ sinh máy giặt trên bTaskee.
Ngày áp dụng
: Tất các các ngày
Giờ áp dụng
: 06:00 - 20:00
Điều kiện và Điều khoản áp dụng Ưu Đãi
Ưu đãi áp dụng cho khách hàng của LifeLink
Áp dụng cho 1 trong các dịch vụ sau: Tổng Vệ sinh, Vệ sinh máy lạnh, Vệ sinh Sofa Nệm Rèm, Vệ sinh máy giặt trên bTaskee
Áp dụng cho tất cả khách hàng
Mỗi voucher chỉ áp dụng một lần duy nhất
Voucher không được hoàn lại và không có giá trị quy đổi thành tiền mặt
Mỗi khách hàng chỉ sử dụng ưu đãi 1 lần
Không áp dụng đồng thời cùng các chương trình ưu đãi khác
Hướng dẫn đặt dịch vụ
Bước 1: Tải và truy cập ứng dụng bTaskee.
Bước 2: Lựa chọn dịch vụ mà bạn muốn sử dụng.
Bước 3: Điền thông tin và yêu cầu công việc.
Bước 4: Nhập mã khuyến mãi của bạn tại bước "Xác nhận và thanh toán" trước khi đăng việc.
Khu vực áp dụng
Áp dụng tại tất cả thành phố bTaskee hoạt đông: TP. Hồ Chí Minh (bao gồm cả các khu vực trước sáp nhập thuộc Bình Dương, Bà Rịa - Vũng Tàu), Hà Nội, Đà Nẵng, Hải Phòng, Lâm Đồng, Khánh Hòa, Đồng Nai, Cần Thơ, Nghệ An, Thanh Hóa, Quy Nhơn
Phụ thu thêm
Khách hàng vui lòng thanh toán thêm giá trị chênh lệch theo xác nhận tại App của bTaskee.
Thông tin liên hệ hỗ trợ
: 1900 636 736',
        100,
        '2026-08-23 00:00:00+00',
        '2026-11-21 00:00:00+00',
        'Dang ban',
        'Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.',
        '//cdn.lifelink.vn/img/c280x280/ADD-bTaskee_27052026090638.jpg?sign=40od9hV7RZFoZkgJVr5DjA',
        0,
        '40000000-0000-0000-0000-000000000005'
    );
--
-- Data for Name: chitietdonhang; Type: TABLE DATA; Schema: public; Owner: postgres
--
INSERT INTO "public"."chitietdonhang" (
        "ma_dh",
        "ma_voucher",
        "so_luong",
        "gia_tai_thoi_diem_mua"
    )
VALUES (
        '3ec3d071-355e-4a88-af3d-ff8f18b41fe6',
        'e26ec4a8-2eb2-4d34-a3cf-e03dad20c141',
        2,
        213750.00
    ),
    (
        '7d837d27-a36b-4769-8b03-d4708625f781',
        '145c7bd7-740d-4ced-9971-b73b22f341e1',
        2,
        450000.00
    ),
    (
        '7d837d27-a36b-4769-8b03-d4708625f781',
        '2c24153a-8bcc-47c9-8f48-5f6e072e9165',
        1,
        550000.00
    ),
    (
        'eb5f634d-0d4d-4086-8ee3-a631a28c9efa',
        '19e389a2-a61b-4400-a352-f521d7812f78',
        1,
        650000.00
    ),
    (
        'eb5f634d-0d4d-4086-8ee3-a631a28c9efa',
        'c20a13d7-c47e-42e9-a0a3-ba515075b1bf',
        1,
        714000.00
    ),
    (
        'b0e9fcfb-6a33-4a30-99ca-f733dfbd84dc',
        '82e65301-9fe0-4cf6-b866-48a82c5250f5',
        1,
        1584000.00
    ),
    (
        'e79579ea-108c-43d4-911a-8ac0eb75cbfb',
        '145c7bd7-740d-4ced-9971-b73b22f341e1',
        1,
        450000.00
    ),
    (
        'e79579ea-108c-43d4-911a-8ac0eb75cbfb',
        'c20a13d7-c47e-42e9-a0a3-ba515075b1bf',
        1,
        714000.00
    ),
    (
        '23630202-3c0c-44e5-81e6-34e3a69c503b',
        '145c7bd7-740d-4ced-9971-b73b22f341e1',
        1,
        450000.00
    ),
    (
        '3ba2f92e-09bd-465c-9705-e195a0cad9f7',
        '145c7bd7-740d-4ced-9971-b73b22f341e1',
        1,
        450000.00
    ),
    (
        '53891e60-c3f6-46f4-b9e5-5c3809eb464a',
        '145c7bd7-740d-4ced-9971-b73b22f341e1',
        1,
        450000.00
    ),
    (
        'd59be9a7-fdee-4327-b440-440fb70d9191',
        'c20a13d7-c47e-42e9-a0a3-ba515075b1bf',
        1,
        714000.00
    ),
    (
        '21244aea-2a16-4236-8cc4-cde57a591e73',
        '145c7bd7-740d-4ced-9971-b73b22f341e1',
        1,
        450000.00
    );
--
-- Data for Name: giohang; Type: TABLE DATA; Schema: public; Owner: postgres
--
INSERT INTO "public"."giohang" (
        "ma_gio_hang",
        "ngay_tao",
        "ngay_cap_nhat",
        "ma_tksohuu"
    )
VALUES (
        'aad1bf6d-97fc-4b15-bdd7-f1580bbaed2c',
        '2026-08-03 16:27:15.941567+00',
        '2026-08-03 16:27:15.941567+00',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        'fc9bed73-88f2-42a8-acf2-324d97ebb343',
        '2026-08-10 02:40:47.863446+00',
        '2026-08-10 02:40:47.863446+00',
        '10000000-0000-0000-0000-000000000001'
    ),
    (
        '811c99c2-cf25-4063-aa04-87da0b0e17b6',
        '2026-08-24 02:42:11.381588+00',
        '2026-08-24 02:42:11.381588+00',
        '10000000-0000-0000-0000-000000000003'
    ),
    (
        'a4775c9e-9b0d-446e-9fe1-9997bf5be36e',
        '2026-08-25 08:54:26.936587+00',
        '2026-08-25 08:54:26.936587+00',
        '2f709c3f-b2d5-4359-9d12-efbb683e1462'
    );
--
-- Data for Name: chitietgiohang; Type: TABLE DATA; Schema: public; Owner: postgres
--
--
-- Data for Name: voucher_mua; Type: TABLE DATA; Schema: public; Owner: postgres
--
INSERT INTO "public"."voucher_mua" (
        "ma_voucher_mua",
        "ma_dh",
        "ma_voucher",
        "voucher_code",
        "thoi_gian_sinh_ma",
        "trang_thai",
        "gia_tri_qr_mo_phong",
        "ngay_su_dung",
        "ma_chi_nhanh_su_dung",
        "ma_nhan_vien_xac_nhan"
    )
VALUES (
        '66806e09-df36-46f4-9fcf-8e692fe7b1d8',
        '3ec3d071-355e-4a88-af3d-ff8f18b41fe6',
        'e26ec4a8-2eb2-4d34-a3cf-e03dad20c141',
        'EC26-HRP5-3A63F95F',
        '2026-08-25 08:40:05.606+00',
        'Chua su dung',
        'ECQR:EC26-HRP5-3A63F95F',
        NULL,
        NULL,
        NULL
    ),
    (
        '44ada943-15b3-47a0-ba71-a87869ac7c8e',
        '3ec3d071-355e-4a88-af3d-ff8f18b41fe6',
        'e26ec4a8-2eb2-4d34-a3cf-e03dad20c141',
        'EC26-179R-840FEEC5',
        '2026-08-25 08:40:05.606+00',
        'Chua su dung',
        'ECQR:EC26-179R-840FEEC5',
        NULL,
        NULL,
        NULL
    ),
    (
        'cdc550d9-9aca-4d03-b9f6-6dce151d3d78',
        '7d837d27-a36b-4769-8b03-d4708625f781',
        '145c7bd7-740d-4ced-9971-b73b22f341e1',
        'EC26-325S-30C32F55',
        '2026-08-25 08:50:43.427+00',
        'Chua su dung',
        'ECQR:EC26-325S-30C32F55',
        NULL,
        NULL,
        NULL
    ),
    (
        'd96a4216-f212-46ed-8f6d-53f432daa70a',
        '7d837d27-a36b-4769-8b03-d4708625f781',
        '145c7bd7-740d-4ced-9971-b73b22f341e1',
        'EC26-M2M8-5820E726',
        '2026-08-25 08:50:43.427+00',
        'Chua su dung',
        'ECQR:EC26-M2M8-5820E726',
        NULL,
        NULL,
        NULL
    ),
    (
        'c496d034-d862-4287-9bce-26fc240045de',
        '7d837d27-a36b-4769-8b03-d4708625f781',
        '2c24153a-8bcc-47c9-8f48-5f6e072e9165',
        'EC26-8SV6-3C924A5E',
        '2026-08-25 08:50:44.481+00',
        'Chua su dung',
        'ECQR:EC26-8SV6-3C924A5E',
        NULL,
        NULL,
        NULL
    ),
    (
        'e95829b3-f152-4c8f-bcb6-da4f00da8837',
        'eb5f634d-0d4d-4086-8ee3-a631a28c9efa',
        '19e389a2-a61b-4400-a352-f521d7812f78',
        'EC26-HPHX-15591AFC',
        '2026-08-25 08:57:53.839+00',
        'Chua su dung',
        'ECQR:EC26-HPHX-15591AFC',
        NULL,
        NULL,
        NULL
    ),
    (
        '3ca7b18f-715d-437f-95cf-0fe18fc78882',
        'eb5f634d-0d4d-4086-8ee3-a631a28c9efa',
        'c20a13d7-c47e-42e9-a0a3-ba515075b1bf',
        'EC26-QJ26-5519B68F',
        '2026-08-25 08:57:54.291+00',
        'Chua su dung',
        'ECQR:EC26-QJ26-5519B68F',
        NULL,
        NULL,
        NULL
    ),
    (
        '6f733143-805f-4195-8f56-0670143ca624',
        'b0e9fcfb-6a33-4a30-99ca-f733dfbd84dc',
        '82e65301-9fe0-4cf6-b866-48a82c5250f5',
        'EC26-PP95-F6E37A01',
        '2026-08-25 08:59:17.732+00',
        'Chua su dung',
        'ECQR:EC26-PP95-F6E37A01',
        NULL,
        NULL,
        NULL
    ),
    (
        'fcf2246d-07f8-439f-9256-52c62b02ced5',
        'e79579ea-108c-43d4-911a-8ac0eb75cbfb',
        '145c7bd7-740d-4ced-9971-b73b22f341e1',
        'EC26-54CD-A71BEBA0',
        '2026-08-25 09:01:59.652+00',
        'Chua su dung',
        'ECQR:EC26-54CD-A71BEBA0',
        NULL,
        NULL,
        NULL
    ),
    (
        '824e3ae2-24c6-40d0-b31a-f850941b374b',
        'e79579ea-108c-43d4-911a-8ac0eb75cbfb',
        'c20a13d7-c47e-42e9-a0a3-ba515075b1bf',
        'EC26-K565-8980F98B',
        '2026-08-25 09:02:00.041+00',
        'Chua su dung',
        'ECQR:EC26-K565-8980F98B',
        NULL,
        NULL,
        NULL
    ),
    (
        '4e41161c-ec50-41e4-b6b9-5f481a91cb0d',
        '23630202-3c0c-44e5-81e6-34e3a69c503b',
        '145c7bd7-740d-4ced-9971-b73b22f341e1',
        'EC26-OWV7-BE7CF1D0',
        '2026-08-25 09:02:31.276+00',
        'Chua su dung',
        'ECQR:EC26-OWV7-BE7CF1D0',
        NULL,
        NULL,
        NULL
    ),
    (
        '50ffb0ea-eeb7-4df1-be88-fa35b1cafd88',
        '3ba2f92e-09bd-465c-9705-e195a0cad9f7',
        '145c7bd7-740d-4ced-9971-b73b22f341e1',
        'EC26-TNMC-FA860105',
        '2026-08-25 09:04:16.688+00',
        'Chua su dung',
        'ECQR:EC26-TNMC-FA860105',
        NULL,
        NULL,
        NULL
    ),
    (
        '3a32bcc0-8b36-403e-b86d-16d6c3aa4f8f',
        '53891e60-c3f6-46f4-b9e5-5c3809eb464a',
        '145c7bd7-740d-4ced-9971-b73b22f341e1',
        'EC26-P93W-102488B6',
        '2026-08-25 09:08:00.549+00',
        'Chua su dung',
        'ECQR:EC26-P93W-102488B6',
        NULL,
        NULL,
        NULL
    ),
    (
        '31c4a853-c19f-4e57-847e-76c098df65b7',
        'd59be9a7-fdee-4327-b440-440fb70d9191',
        'c20a13d7-c47e-42e9-a0a3-ba515075b1bf',
        'EC26-8I6T-BA1B7725',
        '2026-08-25 09:10:08.959+00',
        'Chua su dung',
        'ECQR:EC26-8I6T-BA1B7725',
        NULL,
        NULL,
        NULL
    ),
    (
        '7e4d9a5b-7c5b-4321-84db-3362326c2cc9',
        '21244aea-2a16-4236-8cc4-cde57a591e73',
        '145c7bd7-740d-4ced-9971-b73b22f341e1',
        'EC26-32DH-DFAAEAAD',
        '2026-08-25 09:13:14.151+00',
        'Chua su dung',
        'ECQR:EC26-32DH-DFAAEAAD',
        NULL,
        NULL,
        NULL
    );
--
-- Data for Name: danhgia; Type: TABLE DATA; Schema: public; Owner: postgres
--
--
-- Data for Name: khieunai; Type: TABLE DATA; Schema: public; Owner: postgres
--
--
-- Data for Name: thanhtoan; Type: TABLE DATA; Schema: public; Owner: postgres
--
INSERT INTO "public"."thanhtoan" (
        "ma_thanh_toan",
        "thoi_gian_tt",
        "so_tien",
        "phuong_thuc_tt",
        "trang_thai",
        "ma_dh",
        "ma_gd_goc"
    )
VALUES (
        '31259bf9-f338-4c34-b2ad-029028477553',
        '2026-08-25 08:39:08.777+00',
        427500.00,
        'paypal',
        'Thanh cong',
        '3ec3d071-355e-4a88-af3d-ff8f18b41fe6',
        '9TU891970Y181590F'
    ),
    (
        '52381a5a-5d9f-4ce3-8597-de2930bd8506',
        '2026-08-25 08:50:06.367+00',
        1450000.00,
        'vnpay',
        'That bai',
        '7d837d27-a36b-4769-8b03-d4708625f781',
        NULL
    ),
    (
        '67260ef3-ad78-4a37-8733-5e12ac00612e',
        '2026-08-25 08:50:32.062+00',
        1450000.00,
        'paypal',
        'Thanh cong',
        '7d837d27-a36b-4769-8b03-d4708625f781',
        '26T38675JV669353K'
    ),
    (
        '32a77bcf-8937-4b7c-b6db-48a991d97ace',
        '2026-08-25 08:57:15.747+00',
        1364000.00,
        'vnpay',
        'That bai',
        'eb5f634d-0d4d-4086-8ee3-a631a28c9efa',
        NULL
    ),
    (
        'b8037219-1c8a-4895-bacb-7e3b9a986047',
        '2026-08-25 08:57:42.852+00',
        1364000.00,
        'paypal',
        'Thanh cong',
        'eb5f634d-0d4d-4086-8ee3-a631a28c9efa',
        '36731815P0260073R'
    ),
    (
        '8fc66729-937d-49eb-a498-1e08a28d8e92',
        '2026-08-25 08:58:42.404+00',
        1584000.00,
        'vnpay',
        'That bai',
        'b0e9fcfb-6a33-4a30-99ca-f733dfbd84dc',
        NULL
    ),
    (
        'c35b0d8c-b44e-4ace-acad-c0b33502039d',
        '2026-08-25 08:59:07.543+00',
        1584000.00,
        'paypal',
        'Thanh cong',
        'b0e9fcfb-6a33-4a30-99ca-f733dfbd84dc',
        '1WE401091X6298519'
    ),
    (
        'a7cd0e76-d30f-4eab-8c98-7b6114e7fcc5',
        '2026-08-25 09:01:48.506+00',
        1164000.00,
        'paypal',
        'Thanh cong',
        'e79579ea-108c-43d4-911a-8ac0eb75cbfb',
        '2SH64194390482910'
    ),
    (
        '8647770a-7a13-457c-87ab-d27fd8331833',
        '2026-08-25 09:02:19.981+00',
        450000.00,
        'paypal',
        'Thanh cong',
        '23630202-3c0c-44e5-81e6-34e3a69c503b',
        '1SB23361LM607145S'
    ),
    (
        '80dd6675-6286-4412-8ea5-f4da479cea78',
        '2026-08-25 09:03:39.144+00',
        450000.00,
        'vnpay',
        'That bai',
        '3ba2f92e-09bd-465c-9705-e195a0cad9f7',
        NULL
    ),
    (
        'a78431eb-7574-432e-94a8-d48e9fff3c1a',
        '2026-08-25 09:04:05.189+00',
        450000.00,
        'paypal',
        'Thanh cong',
        '3ba2f92e-09bd-465c-9705-e195a0cad9f7',
        '6G74858144077281D'
    ),
    (
        '079fc33a-ec54-487a-930f-ab86a5a76fdb',
        '2026-08-25 09:07:48.549+00',
        450000.00,
        'paypal',
        'Thanh cong',
        '53891e60-c3f6-46f4-b9e5-5c3809eb464a',
        '4LX75985G0955435H'
    ),
    (
        'c1f73a7a-39dc-43fe-b899-cbd318c50b03',
        '2026-08-25 09:09:39.833+00',
        714000.00,
        'vnpay',
        'That bai',
        'd59be9a7-fdee-4327-b440-440fb70d9191',
        NULL
    ),
    (
        'e022d733-54f7-4e14-9b22-b0958c5adb68',
        '2026-08-25 09:09:59.741+00',
        714000.00,
        'paypal',
        'Thanh cong',
        'd59be9a7-fdee-4327-b440-440fb70d9191',
        '9CV26963AS8752506'
    ),
    (
        'c4c488e6-91a8-41c3-9abc-5e1168c9cc8d',
        '2026-08-25 09:12:58.559+00',
        450000.00,
        'paypal',
        'Thanh cong',
        '21244aea-2a16-4236-8cc4-cde57a591e73',
        '3WT06973G6112272T'
    );
--
-- Data for Name: yeucauhuy; Type: TABLE DATA; Schema: public; Owner: postgres
--
--
-- Data for Name: hoantien; Type: TABLE DATA; Schema: public; Owner: postgres
--
--
-- Data for Name: log_ht; Type: TABLE DATA; Schema: public; Owner: postgres
--
INSERT INTO "public"."log_ht" (
        "log_id",
        "vai_tro_thuc_hien",
        "hanh_dong",
        "du_lieu_truoc",
        "du_lieu_sau",
        "ket_qua",
        "ly_do_thuc_hien",
        "thoi_diem_thuc_hien",
        "ma_tk_thuc_hien",
        "doi_tuong",
        "ma_doi_tuong"
    )
VALUES (
        '2432bc6e-4033-42f6-bd2a-00ce9573a1cf',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 07:43:13.516146+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '74a26a14-41cf-412b-8742-859fd5874633',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 07:43:50.722465+00',
        '10000000-0000-0000-0000-000000000003',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000003'
    ),
    (
        'eb98eb08-4796-4dd8-83f2-7bb270a44e4c',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 07:44:12.885332+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        'f05169da-12b3-46c2-8c3e-4975f7ca3adb',
        'ADMIN_MODERATION',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 07:44:23.883579+00',
        '10000000-0000-0000-0000-000000000102',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000102'
    ),
    (
        '24b30da8-7a30-4e2f-8650-3e7b4c8180d3',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 07:44:39.036203+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        'bc9437ea-2632-470a-9d8d-168d67b75141',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 07:48:31.18303+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '0d8115aa-7865-47f9-ba64-593233febe85',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 07:48:56.296756+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '0c03ccb5-7820-4a5c-8d08-7e9c53d221c3',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 07:49:46.586908+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '83a9b68a-b23c-45b2-86a7-47af3917057b',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 07:55:20.412809+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '4e101c6c-6a29-4ef7-baed-a09bbc6dfdd9',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 07:59:50.170385+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '0a4c1c3c-2e0c-4f3f-915a-1caa42c94c56',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 08:17:31.208374+00',
        '10000000-0000-0000-0000-000000000003',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000003'
    ),
    (
        'eb434ed6-5cd2-4ff7-873f-ce2adf49a11f',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 08:21:09.575325+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '43259cfe-c65a-40f3-abb9-cebc62f137b5',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 08:22:25.501962+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '0fb845c2-b63b-4088-ae73-02d619ed5d04',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 08:24:36.954241+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '17c4854d-a060-4142-a6d2-0524a25359eb',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 08:24:45.410142+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        'e80f725c-8eb0-46ae-b457-0c08c92ef1b9',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 08:24:56.506242+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '61f85107-93a2-4bb2-8f7b-80b0c1b99d44',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 08:25:09.761739+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        'de1ec268-c390-4c47-88a2-8fdada715cf7',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 08:25:36.045732+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '43eb4ef1-fffa-4af2-90eb-87ec0adec7ee',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 08:26:01.038206+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '5b12e508-325e-40f3-ab64-017ccfb1cad6',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 08:28:40.120516+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '9078bb90-a1a3-460d-a4c1-5980cbddfa8f',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 08:29:24.861288+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '496709f1-cd5b-46f5-9f1f-42a36c376f39',
        'ADMIN_OPERATION',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 08:32:42.323368+00',
        '10000000-0000-0000-0000-000000000103',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000103'
    ),
    (
        '72859557-6d1f-4ce7-8e7c-cbed7ed4c7b5',
        'ADMIN_MODERATION',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 08:32:48.909188+00',
        '10000000-0000-0000-0000-000000000102',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000102'
    ),
    (
        '16c6e9d6-10fa-4957-aa1f-aff152c039fa',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 08:47:45.206194+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '6e1546ac-e2e3-4eb9-9c49-a1a616bc4385',
        'ADMIN_MODERATION',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 08:47:59.228653+00',
        '10000000-0000-0000-0000-000000000102',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000102'
    ),
    (
        'be4d9998-da08-4a40-8b66-61aad99f454f',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 08:48:06.697892+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '6857c49c-3b5a-4041-9fc2-e0c36f6b806e',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 08:49:49.866933+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '8a79a34b-5cfb-4509-a7f3-f7ac19d2413c',
        'ADMIN_MODERATION',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 08:50:06.892412+00',
        '10000000-0000-0000-0000-000000000102',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000102'
    ),
    (
        '75cc87e8-6f9d-46dd-b891-4b23a005e19e',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 08:57:03.010102+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '896351c2-4fab-4df8-ab75-75c5f1a7c9e6',
        'ADMIN_SYSTEM',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 08:58:58.201389+00',
        '10000000-0000-0000-0000-000000000101',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000101'
    ),
    (
        '7f3226b2-4468-4389-b242-28dc0a1bfa61',
        'ADMIN_SYSTEM',
        'LOCK_USER',
        '{"trang_thai": "Dang hoat dong"}',
        '{"trang_thai": "Tam khoa"}',
        'Thanh cong',
        'demo',
        '2026-08-24 09:01:23.250285+00',
        '10000000-0000-0000-0000-000000000101',
        'NGUOIDUNG',
        '6b698647-8fca-4fa8-b9cf-1629255158c2'
    ),
    (
        'aaa84bc3-d4f0-43ac-b80e-7db0c17dda13',
        'ADMIN_SYSTEM',
        'UNLOCK_USER',
        '{"trang_thai": "Tam khoa"}',
        '{"trang_thai": "Dang hoat dong"}',
        'Thanh cong',
        'test demo',
        '2026-08-24 09:01:58.304718+00',
        '10000000-0000-0000-0000-000000000101',
        'NGUOIDUNG',
        '6b698647-8fca-4fa8-b9cf-1629255158c2'
    ),
    (
        'a23a7374-5abe-4b24-ba8e-97316fe8f24e',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 09:07:23.617387+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        'f7df9219-ad76-4979-a4d0-261f15731e7f',
        'ADMIN_SYSTEM',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 09:11:33.438304+00',
        '10000000-0000-0000-0000-000000000101',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000101'
    ),
    (
        '5b3913ca-0315-46e1-9bf9-850c7d6daed0',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 09:11:36.386678+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '14b0590c-cae3-43e1-8b60-845e6585efca',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 09:12:28.526557+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '4cfd764e-0196-4e92-96ab-1f4105844946',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-24 13:09:26.063629+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '7a28444e-dd1a-46ed-8633-3f5d345e37c2',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-25 07:00:19.618418+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '321abe9e-71a3-4303-a1cc-5190ee807209',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-25 07:32:08.714448+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '4893a99f-a26d-4074-b5e7-57a812ab8c11',
        'ADMIN_OPERATION',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-25 07:32:43.877711+00',
        '10000000-0000-0000-0000-000000000103',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000103'
    ),
    (
        'a07ca876-9169-45c2-8c83-ef06d8a5ce76',
        'ADMIN_MODERATION',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-25 07:32:57.685691+00',
        '10000000-0000-0000-0000-000000000102',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000102'
    ),
    (
        '2194be72-ee65-4020-937b-38d34fab93f4',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-25 07:39:07.143411+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '6ae70116-db14-4365-b153-1e17778900b8',
        'ADMIN_OPERATION',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-25 07:54:08.863529+00',
        '10000000-0000-0000-0000-000000000103',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000103'
    ),
    (
        '1d90f486-3cc1-44eb-be24-4388f73558ef',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-25 07:54:12.801906+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        'ce3a9c4e-a2b9-47b1-88f5-e3f5b81ae3ca',
        'ADMIN_OPERATION',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-25 07:54:32.033889+00',
        '10000000-0000-0000-0000-000000000103',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000103'
    ),
    (
        'de571216-b887-41c0-b544-c5289c6f1ac8',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-25 07:54:35.899198+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        'e2c10876-e952-414d-9337-37c28657b1d3',
        'ADMIN_MODERATION',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-25 07:55:35.855388+00',
        '10000000-0000-0000-0000-000000000102',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000102'
    ),
    (
        '7d8cbbd1-59b0-40e9-9ff4-3b05be21f23c',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-25 07:56:28.328817+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '4aa9e2d2-a0ff-4336-a2a7-373bb7be9cee',
        'ADMIN_OPERATION',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-25 08:09:34.066326+00',
        '10000000-0000-0000-0000-000000000103',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000103'
    ),
    (
        '88f5cbbe-3f92-44a3-af3e-6b807feb1578',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-25 08:09:38.247792+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        'f3f1f857-98c6-4fc9-9607-3e2bc91314e6',
        'ADMIN_OPERATION',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-25 08:10:51.946062+00',
        '10000000-0000-0000-0000-000000000103',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000103'
    ),
    (
        '854da940-09b9-4c9b-af04-a7d5c08e716f',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-25 08:36:40.769418+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        'e77b7124-83b1-4d3d-a768-232d515ad815',
        'SYSTEM',
        'ISSUE_VOUCHER_CODE',
        NULL,
        '{"codes": ["EC26-HRP5-3A63F95F", "EC26-179R-840FEEC5"], "issuedCount": 2}',
        'Thanh cong',
        'Phát hành 2 mã voucher sau thanh toán thành công',
        '2026-08-25 08:40:06.665287+00',
        '2f709c3f-b2d5-4359-9d12-efbb683e1462',
        'DONHANG',
        '3ec3d071-355e-4a88-af3d-ff8f18b41fe6'
    ),
    (
        '0528e3ef-374f-4b8c-9d42-071f53f1f046',
        'SYSTEM',
        'ISSUE_VOUCHER_CODE',
        NULL,
        '{"codes": ["EC26-325S-30C32F55", "EC26-M2M8-5820E726", "EC26-8SV6-3C924A5E"], "issuedCount": 3}',
        'Thanh cong',
        'Phát hành 3 mã voucher sau thanh toán thành công',
        '2026-08-25 08:50:45.092136+00',
        '2f709c3f-b2d5-4359-9d12-efbb683e1462',
        'DONHANG',
        '7d837d27-a36b-4769-8b03-d4708625f781'
    ),
    (
        'de6f4bbe-08c4-459f-b2e4-16d331e21427',
        'SYSTEM',
        'ISSUE_VOUCHER_CODE',
        NULL,
        '{"codes": ["EC26-HPHX-15591AFC", "EC26-QJ26-5519B68F"], "issuedCount": 2}',
        'Thanh cong',
        'Phát hành 2 mã voucher sau thanh toán thành công',
        '2026-08-25 08:57:54.91173+00',
        '2f709c3f-b2d5-4359-9d12-efbb683e1462',
        'DONHANG',
        'eb5f634d-0d4d-4086-8ee3-a631a28c9efa'
    ),
    (
        'e3b4cb76-bf75-45a1-92a4-5897608e094a',
        'SYSTEM',
        'ISSUE_VOUCHER_CODE',
        NULL,
        '{"codes": ["EC26-PP95-F6E37A01"], "issuedCount": 1}',
        'Thanh cong',
        'Phát hành 1 mã voucher sau thanh toán thành công',
        '2026-08-25 08:59:18.884287+00',
        '2f709c3f-b2d5-4359-9d12-efbb683e1462',
        'DONHANG',
        'b0e9fcfb-6a33-4a30-99ca-f733dfbd84dc'
    ),
    (
        '55514db7-dbe7-4b5f-a97e-0e82de99988e',
        'SYSTEM',
        'ISSUE_VOUCHER_CODE',
        NULL,
        '{"codes": ["EC26-54CD-A71BEBA0", "EC26-K565-8980F98B"], "issuedCount": 2}',
        'Thanh cong',
        'Phát hành 2 mã voucher sau thanh toán thành công',
        '2026-08-25 09:02:00.642535+00',
        '2f709c3f-b2d5-4359-9d12-efbb683e1462',
        'DONHANG',
        'e79579ea-108c-43d4-911a-8ac0eb75cbfb'
    ),
    (
        '030df648-8835-4833-9907-da431b627166',
        'SYSTEM',
        'ISSUE_VOUCHER_CODE',
        NULL,
        '{"codes": ["EC26-OWV7-BE7CF1D0"], "issuedCount": 1}',
        'Thanh cong',
        'Phát hành 1 mã voucher sau thanh toán thành công',
        '2026-08-25 09:02:31.868162+00',
        '2f709c3f-b2d5-4359-9d12-efbb683e1462',
        'DONHANG',
        '23630202-3c0c-44e5-81e6-34e3a69c503b'
    ),
    (
        '6a5d810f-eb26-4759-bf0f-2b991dcdc993',
        'SYSTEM',
        'ISSUE_VOUCHER_CODE',
        NULL,
        '{"codes": ["EC26-TNMC-FA860105"], "issuedCount": 1}',
        'Thanh cong',
        'Phát hành 1 mã voucher sau thanh toán thành công',
        '2026-08-25 09:04:17.340904+00',
        '2f709c3f-b2d5-4359-9d12-efbb683e1462',
        'DONHANG',
        '3ba2f92e-09bd-465c-9705-e195a0cad9f7'
    ),
    (
        '9cb01b66-3f91-4076-90e8-f89658dad204',
        'SYSTEM',
        'ISSUE_VOUCHER_CODE',
        NULL,
        '{"codes": ["EC26-P93W-102488B6"], "issuedCount": 1}',
        'Thanh cong',
        'Phát hành 1 mã voucher sau thanh toán thành công',
        '2026-08-25 09:08:01.134172+00',
        '2f709c3f-b2d5-4359-9d12-efbb683e1462',
        'DONHANG',
        '53891e60-c3f6-46f4-b9e5-5c3809eb464a'
    ),
    (
        '277d082e-95fb-4ccf-a420-9bab5ae0bca0',
        'SYSTEM',
        'ISSUE_VOUCHER_CODE',
        NULL,
        '{"codes": ["EC26-8I6T-BA1B7725"], "issuedCount": 1}',
        'Thanh cong',
        'Phát hành 1 mã voucher sau thanh toán thành công',
        '2026-08-25 09:10:09.730092+00',
        '2f709c3f-b2d5-4359-9d12-efbb683e1462',
        'DONHANG',
        'd59be9a7-fdee-4327-b440-440fb70d9191'
    ),
    (
        '98c604db-2644-4c18-8884-b9543a31a545',
        'SYSTEM',
        'ISSUE_VOUCHER_CODE',
        NULL,
        '{"codes": ["EC26-32DH-DFAAEAAD"], "issuedCount": 1}',
        'Thanh cong',
        'Phát hành 1 mã voucher sau thanh toán thành công',
        '2026-08-25 09:13:14.743182+00',
        '2f709c3f-b2d5-4359-9d12-efbb683e1462',
        'DONHANG',
        '21244aea-2a16-4236-8cc4-cde57a591e73'
    ),
    (
        'c6179418-86cc-40cb-b717-35da2229a841',
        'PARTNER_OWNER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-25 09:14:51.419602+00',
        '10000000-0000-0000-0000-000000000011',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000011'
    ),
    (
        '37f74dc7-d79a-40fb-960c-6d9f87e622cb',
        'PARTNER_OWNER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-25 09:19:28.648866+00',
        '7ea9c914-f58e-46ad-ae35-0ed7941f7904',
        'TAIKHOAN',
        '7ea9c914-f58e-46ad-ae35-0ed7941f7904'
    ),
    (
        'dd931df2-28ae-4db2-aae7-4cd771946628',
        'PARTNER_OWNER',
        'UPDATE_VOUCHER',
        '{"trang_thai": "Dang ban", "ten_voucher": "DuYen Cruise - Du ngoạn Vịnh Hạ Long 2 ngày 1 đêm"}',
        '{"trang_thai": "Tam ngung", "ten_voucher": "DuYen Cruise - Du ngoạn Vịnh Hạ Long 2 ngày 1 đêm"}',
        'Thanh cong',
        'Cập nhật thông tin chi tiết chương trình Voucher',
        '2026-08-25 09:19:49.107175+00',
        '7ea9c914-f58e-46ad-ae35-0ed7941f7904',
        'VOUCHER',
        '4e1cc348-8c38-4f4b-802f-b35e684bc5c8'
    ),
    (
        'd6d25497-7fc7-476b-a005-12015c6d5ec9',
        'PARTNER_OWNER',
        'UPDATE_VOUCHER',
        '{"trang_thai": "Tam ngung", "ten_voucher": "DuYen Cruise - Du ngoạn Vịnh Hạ Long 2 ngày 1 đêm"}',
        '{"trang_thai": "Tam ngung", "ten_voucher": "DuYen Cruise - Halong Bay Excursion 2 Days 1 Night"}',
        'Thanh cong',
        'Cập nhật thông tin chi tiết chương trình Voucher',
        '2026-08-25 09:20:21.381699+00',
        '7ea9c914-f58e-46ad-ae35-0ed7941f7904',
        'VOUCHER',
        '4e1cc348-8c38-4f4b-802f-b35e684bc5c8'
    ),
    (
        'b3c2c4c7-6102-4171-8b37-54f3b694cd7f',
        'PARTNER',
        'CREATE_STAFF',
        NULL,
        '{"sdt": "3093939939", "email": "nnl1@gmail.com", "ho_ten": "Nguyễn Ngọc Linh", "vai_tro": "Quản lý vận hành", "ma_chi_nhanh": null}',
        'Thanh cong',
        'Thêm nhân viên mới vào hệ thống',
        '2026-08-25 09:21:31.148586+00',
        '7ea9c914-f58e-46ad-ae35-0ed7941f7904',
        'NGUOIDUNG',
        '7ea47cd9-a0f5-4eb8-81a6-d7fb7df7be76'
    ),
    (
        '612b9f4b-3826-4024-b917-ae894b8434a3',
        'PARTNER_OWNER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-25 09:23:28.512334+00',
        'a11de0e1-a930-4e0d-857d-01835d151b3d',
        'TAIKHOAN',
        'a11de0e1-a930-4e0d-857d-01835d151b3d'
    ),
    (
        '84d294f6-58bf-404e-a3ff-0baece1dc260',
        'PARTNER',
        'LOGIN',
        NULL,
        NULL,
        'That bai',
        'Không tìm thấy tài khoản: nnl1@ec.local',
        '2026-08-25 09:25:01.559579+00',
        '2f709c3f-b2d5-4359-9d12-efbb683e1462',
        'TAIKHOAN',
        NULL
    ),
    (
        '49a3ddac-4c2a-4cd7-887e-53f9eda7e455',
        'PARTNER',
        'LOGIN',
        NULL,
        NULL,
        'That bai',
        'Không tìm thấy tài khoản: nnl1@ec.local',
        '2026-08-25 09:25:07.501373+00',
        '2f709c3f-b2d5-4359-9d12-efbb683e1462',
        'TAIKHOAN',
        NULL
    ),
    (
        '33d18dfd-d309-4401-bb3f-2eda534622a9',
        'PARTNER_MANAGER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-25 09:25:15.624744+00',
        '87700ee1-5a78-4728-881a-95b2a12027c4',
        'TAIKHOAN',
        '87700ee1-5a78-4728-881a-95b2a12027c4'
    ),
    (
        'f52ac6f9-8483-4884-b6df-2da09db91608',
        'PARTNER_MANAGER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-25 09:25:15.848669+00',
        '87700ee1-5a78-4728-881a-95b2a12027c4',
        'TAIKHOAN',
        '87700ee1-5a78-4728-881a-95b2a12027c4'
    ),
    (
        '216b5892-a3c5-422a-ac20-6e991509e973',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-25 11:09:07.19033+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    ),
    (
        '75e5d5fd-bf2c-470f-a6a6-f3b1c4792fc8',
        'CUSTOMER',
        'LOGIN',
        NULL,
        NULL,
        'Thanh cong',
        NULL,
        '2026-08-25 11:14:53.892159+00',
        '10000000-0000-0000-0000-000000000002',
        'TAIKHOAN',
        '10000000-0000-0000-0000-000000000002'
    );
--
-- Data for Name: lssinhma; Type: TABLE DATA; Schema: public; Owner: postgres
--
--
-- Data for Name: noidung; Type: TABLE DATA; Schema: public; Owner: postgres
--
INSERT INTO "public"."noidung" (
        "ma_nd",
        "loai",
        "tieu_de",
        "trang_thai",
        "noi_dung",
        "bat_dau_hien_thi",
        "ket_thuc_hien_thi",
        "ngay_tao",
        "ngay_cap_nhat",
        "matk_admin",
        "hinh_anh_url"
    )
VALUES (
        'b0000000-0000-0000-0000-000000000003',
        'popup',
        'ĐI 4 TẶNG 1: Buffet Hải Sản Tươi Ngon Tại Trung Tâm',
        'Dang hien thi',
        'Ưu đãi "ĐI 4 TẶNG 1" (tương đương giảm 25% cho nhóm 4) được làm nổi bật để thu hút nhóm bạn hoặc gia đình. Một nút "ĐẶT BÀN" màu đỏ kêu gọi hành động đặt chỗ ngay.',
        '2026-08-02 09:34:18.18177+00',
        '2026-08-03 09:34:18.18177+00',
        '2026-07-26 09:34:18.18177+00',
        '2026-08-24 08:46:09.383+00',
        '10000000-0000-0000-0000-000000000001',
        'https://qsbnxxkqosnoomzgjtyp.supabase.co/storage/v1/object/public/partner-documents/content/1787561119679_kc0jsl.jpg'
    ),
    (
        'ef654b72-d650-4885-a10a-77af6d05ab83',
        'popup',
        'FLASH SALE ĐÀ NẴNG! Combo 3N2Đ Resort 5 Sao - Giảm 45%',
        'Dang hien thi',
        'Ưu đãi giảm giá sâu 45% và dòng chữ "Flash Sale" nổi bật để tạo cảm giác cấp bách. Một nút "ĐẶT NGAY" màu cam kêu gọi hành động tức thì. Thích hợp để quảng bá các gói combo giới hạn thời gian (ví dụ 24h).',
        NULL,
        NULL,
        '2026-08-13 03:26:34.912545+00',
        '2026-08-24 08:46:12.172+00',
        '10000000-0000-0000-0000-000000000001',
        'https://qsbnxxkqosnoomzgjtyp.supabase.co/storage/v1/object/public/partner-documents/content/1787561161836_r558oc.jpg'
    ),
    (
        'b0000000-0000-0000-0000-000000000004',
        'chinh_sach',
        'Chính sách hoàn huỷ voucher',
        'Tam an',
        '<h1>✨ CHÍNH SÁCH HOÀN HỦY VÀ ĐỔI TRẢ VOUCHER ✨</h1><blockquote><p>💙 <strong>Quyền lợi của Khách hàng luôn là ưu tiên hàng đầu.</strong><br>Vui lòng đọc kỹ chính sách dưới đây để nắm rõ điều kiện hoàn, hủy và đổi trả voucher trước khi gửi yêu cầu.</p></blockquote><hr><h2>🔹 1. ĐIỀU KIỆN HOÀN/HỦY VOUCHER</h2><p>Voucher được chấp nhận <strong>hoàn/hủy</strong> khi đáp ứng đầy đủ các điều kiện sau:</p><ul><li><p>✅ <strong>Voucher chưa được sử dụng:</strong> Chưa từng kích hoạt, quét mã QR/Barcode hoặc nhập mã thanh toán tại hệ thống/đối tác.</p></li><li><p>⏰ <strong>Còn thời hạn sử dụng:</strong> Voucher vẫn còn hiệu lực tại thời điểm Khách hàng gửi yêu cầu hoàn/hủy.</p></li><li><p>🏷️ <strong>Voucher có hỗ trợ hoàn/hủy:</strong> Chỉ áp dụng với những voucher được quy định <strong>có thể hoàn/hủy</strong> tại thời điểm mua, được thể hiện rõ trong phần <em>Điều kiện áp dụng</em>.</p></li><li><p>🛠️ <strong>Trường hợp bất khả kháng:</strong> Hỗ trợ xem xét khi xảy ra lỗi hệ thống, đối tác ngừng cung cấp dịch vụ hoặc thông tin voucher sai lệch so với mô tả.</p></li></ul><hr><h2>🚫 2. CÁC TRƯỜNG HỢP KHÔNG HỖ TRỢ HOÀN/HỦY</h2><p>Hệ thống <strong>không hỗ trợ hoàn tiền hoặc hủy voucher</strong> trong các trường hợp:</p><ul><li><p>❌ Voucher thuộc danh mục <strong>“Không hoàn/hủy/đổi trả”</strong>.</p></li><li><p>❌ Voucher đã <strong>hết hạn sử dụng</strong>.</p></li><li><p>❌ Voucher đã được <strong>kích hoạt, đổi hoặc sử dụng</strong> một phần/toàn bộ.</p></li><li><p>❌ Khách hàng làm <strong>lộ hoặc mất mã voucher</strong>, dẫn đến việc voucher đã được người khác sử dụng.</p></li></ul><blockquote><p>⚠️ <strong>Lưu ý:</strong> Khách hàng vui lòng kiểm tra kỹ điều kiện sử dụng trước khi mua và trước khi gửi yêu cầu hoàn/hủy.</p></blockquote><hr><h2>💰 3. PHƯƠNG THỨC HOÀN TIỀN &amp; THỜI GIAN XỬ LÝ</h2><p>Tùy theo phương thức thanh toán ban đầu, khoản tiền hoàn sẽ được gửi về kênh tương ứng:</p><p>💳 Phương thức thanh toán🔄 Phương thức hoàn tiền⏱️ Thời gian dự kiến<strong>Ví điện tử / Thẻ nội địa (NAPAS)</strong>Hoàn về Ví / Tài khoản ngân hàng ban đầu<strong>1 – 3 ngày làm việcThẻ ghi nợ / Thẻ tín dụng (Visa, Master)</strong>Hoàn về hạn mức thẻ<strong>5 – 15 ngày làm việc</strong> <em>(tùy ngân hàng)</em><strong>Điểm thưởng / Ví Voucher</strong>Hoàn lại điểm/voucher tương ứng<strong>Trong vòng 24 giờ</strong></p><blockquote><p>💡 <strong>Lưu ý:</strong> Số tiền hoàn trả là <strong>số tiền thực tế Khách hàng đã thanh toán</strong>, sau khi đã trừ các chương trình khuyến mãi, giảm giá hoặc ưu đãi khác (nếu có).</p></blockquote><hr><h2>📋 4. QUY TRÌNH GỬI YÊU CẦU HOÀN/HỦY</h2><h3>➡️ BƯỚC 1 — CHỌN VOUCHER</h3><p>Truy cập <strong>“Ví Voucher / Đơn hàng của tôi”</strong> trên App/Website → Chọn voucher mà bạn muốn hoàn/hủy.</p><h3>➡️ BƯỚC 2 — GỬI YÊU CẦU</h3><p>Nhấn <strong>“Yêu cầu hoàn/hủy”</strong> → Chọn lý do phù hợp.</p><p>📞 Ngoài ra, Khách hàng có thể liên hệ trực tiếp <strong>CSKH qua Hotline/Email</strong> để được hỗ trợ.</p><h3>➡️ BƯỚC 3 — KIỂM TRA</h3><p>Bộ phận <strong>Chăm sóc khách hàng</strong> tiến hành kiểm tra trạng thái voucher và điều kiện hoàn/hủy trên hệ thống.</p><h3>➡️ BƯỚC 4 — NHẬN KẾT QUẢ</h3><p>Khách hàng nhận thông báo về <strong>kết quả xử lý và tiến trình hoàn tiền</strong> qua Email hoặc Push Notification.</p><hr><h2>🔄 5. ĐỔI VOUCHER</h2><p>Việc đổi voucher được thực hiện tùy theo <strong>điều kiện của từng chương trình/voucher</strong>.</p><p>Khách hàng chỉ được hỗ trợ đổi khi:</p><ul><li><p>Voucher vẫn còn hiệu lực.</p></li><li><p>Voucher chưa được sử dụng hoặc kích hoạt.</p></li><li><p>Voucher có quy định <strong>cho phép đổi</strong>.</p></li><li><p>Voucher mới có giá trị/điều kiện phù hợp theo quy định của chương trình.</p></li></ul><blockquote><p>📌 <strong>Khuyến nghị:</strong> Hãy kiểm tra phần <strong>“Điều kiện áp dụng”</strong> của voucher trước khi mua để tránh phát sinh bất tiện trong quá trình đổi trả.</p></blockquote><hr><h2>📞 6. THÔNG TIN LIÊN HỆ HỖ TRỢ</h2><p>Nếu có bất kỳ thắc mắc nào về <strong>hoàn, hủy, đổi trả voucher hoặc xử lý đơn hàng</strong>, Quý khách vui lòng liên hệ:</p><p><strong>☎️ Hotline CSKH:</strong> <code>0967456832</code><br><strong>🕐 Thời gian hỗ trợ:</strong> <code>08:00 – 22:00</code> hằng ngày<br><strong>📧 Email:</strong> <code>nkngan23@clc.fitus.edu.vn</code></p><blockquote><p>💙 <strong>Chúng tôi luôn sẵn sàng hỗ trợ để đảm bảo trải nghiệm mua và sử dụng voucher của Quý khách được thuận tiện nhất.</strong></p></blockquote><hr><h3>✦ CẢM ƠN QUÝ KHÁCH ĐÃ TIN TƯỞNG VÀ ĐỒNG HÀNH ✦</h3><p></p>',
        '2026-05-29 09:34:18.18177+00',
        NULL,
        '2026-05-24 09:34:18.18177+00',
        '2026-08-23 17:37:32.042+00',
        '10000000-0000-0000-0000-000000000001',
        NULL
    ),
    (
        '061f9472-2a69-4504-a514-791c891fe8b6',
        'chinh_sach',
        'Chính sách đối tác',
        'Tam an',
        '<h1>🤝 CHÍNH SÁCH DÀNH CHO ĐỐI TÁC THAM GIA HỆ THỐNG VOUCHER</h1><blockquote><p>🌟 <strong>Đồng hành cùng Đối tác – Cùng phát triển bền vững</strong><br>Chính sách này quy định các <strong>điều khoản, quyền lợi và trách nhiệm</strong> áp dụng cho Doanh nghiệp, Thương hiệu và Nhà cung cấp khi đăng ký tham gia phát hành và kinh doanh voucher trên nền tảng của chúng tôi.</p></blockquote><hr><h2>🏢 1. ĐIỀU KIỆN &amp; QUY TRÌNH THAM GIA</h2><h3>📌 1.1. ĐIỀU KIỆN ĐĂNG KÝ</h3><p>Để trở thành Đối tác của hệ thống, doanh nghiệp cần đáp ứng các điều kiện sau:</p><ul><li><p>🏷️ <strong>Có tư cách kinh doanh hợp pháp:</strong> Là doanh nghiệp, hộ kinh doanh hoặc thương hiệu có giấy phép kinh doanh hợp lệ.</p></li><li><p>📄 <strong>Cung cấp đầy đủ hồ sơ pháp lý:</strong> Bao gồm <strong>Mã số thuế, Giấy phép đăng ký kinh doanh, Giấy ủy quyền thương hiệu</strong> (nếu có).</p></li><li><p>⭐ <strong>Đảm bảo chất lượng:</strong> Cam kết sản phẩm/dịch vụ cung cấp đúng chất lượng và <strong>đúng với thông tin mô tả trên voucher</strong>.</p></li><li><p>🤝 <strong>Tuân thủ chính sách:</strong> Cam kết thực hiện đầy đủ các quy định và thỏa thuận hợp tác với nền tảng.</p></li></ul><hr><h3>🚀 1.2. QUY TRÌNH 4 BƯỚC THAM GIA</h3><p>🔢 Bước📋 Nội dung📝 Mô tả<strong>01</strong>👤 <strong>Đăng ký tài khoản</strong>Tạo hồ sơ doanh nghiệp và tài khoản Đối tác trên hệ thống.<strong>02</strong>🔍 <strong>Xác minh &amp; duyệt hồ sơ</strong>Hệ thống kiểm tra, xác thực thông tin pháp lý trong <strong>24 – 48 giờ</strong>.<strong>03</strong>🎟️ <strong>Tạo chiến dịch Voucher</strong>Thiết lập mã voucher, giá bán, số lượng và thời hạn sử dụng.<strong>04</strong>📊 <strong>Phát hành &amp; quản lý</strong>Voucher được duyệt và hiển thị công khai; Đối tác quản lý đơn hàng, lượt sử dụng và đối soát trên <strong>Dashboard</strong>.</p><blockquote><p>💡 <strong>Mẹo:</strong> Hãy chuẩn bị đầy đủ hồ sơ pháp lý ngay từ đầu để quá trình xét duyệt diễn ra nhanh chóng và thuận lợi hơn.</p></blockquote><hr><h1>💰 2. MÔ HÌNH CHIẾT KHẤU &amp; THANH TOÁN</h1><h2>💳 2.1. PHÍ DỊCH VỤ &amp; CHIẾT KHẤU</h2><h3>🆓 Phí duy trì nền tảng</h3><p><strong>Miễn phí</strong> tạo gian hàng và niêm yết voucher trên hệ thống.</p><h3>📉 Phí hoa hồng / giao dịch</h3><p>Nền tảng sẽ <strong>khấu trừ phí hoa hồng trực tiếp</strong> trên mỗi voucher được khách hàng <strong>đổi/sử dụng thành công</strong>.</p><blockquote><p>📌 <strong>Lưu ý:</strong> Tỷ lệ hoa hồng cụ thể được áp dụng theo <strong>hợp đồng/thỏa thuận hợp tác</strong> giữa nền tảng và từng Đối tác.</p></blockquote><hr><h2>📅 2.2. CHU KỲ ĐỐI SOÁT &amp; THANH TOÁN</h2><p>Hệ thống thực hiện đối soát định kỳ <strong>02 lần mỗi tháng</strong>:</p><p>📅 Thời điểm🔎 Nội dung<strong>Ngày 15 hằng tháng</strong>Chốt dữ liệu voucher đã sử dụng trong kỳ<strong>Ngày cuối tháng</strong>Chốt dữ liệu voucher đã sử dụng trong kỳ</p><h3>🔄 Điều kiện đối soát</h3><p>Hệ thống tổng hợp các voucher có trạng thái:</p><blockquote><p>🎟️ <code>Đã sử dụng (Redeemed)</code></p></blockquote><h3>🏦 Hình thức thanh toán</h3><p>Khoản tiền đối soát được <strong>chuyển khoản trực tiếp</strong> vào tài khoản ngân hàng doanh nghiệp mà Đối tác đã đăng ký.</p><p>⏱️ <strong>Thời gian thanh toán dự kiến:</strong> <strong>03 – 05 ngày làm việc</strong> kể từ ngày chốt đối soát.</p><hr><h1>🤝 3. TRÁCH NHIỆM &amp; CAM KẾT CỦA ĐỐI TÁC</h1><p>Để đảm bảo trải nghiệm tốt nhất cho khách hàng, Đối tác có trách nhiệm:</p><h3>🎫 01. TIẾP NHẬN &amp; PHỤC VỤ</h3><p>Đảm bảo tiếp nhận và phục vụ khách hàng sử dụng <strong>voucher hợp lệ</strong>, không có hành vi phân biệt đối xử so với khách hàng thanh toán bằng phương thức thông thường.</p><h3>📲 02. ĐỒNG BỘ TRẠNG THÁI VOUCHER</h3><p>Thực hiện <strong>quét mã QR / xác nhận voucher ngay tại thời điểm khách hàng sử dụng dịch vụ</strong> nhằm đảm bảo trạng thái voucher được cập nhật chính xác và hạn chế phát sinh khiếu nại.</p><h3>🔐 03. BẢO MẬT &amp; MINH BẠCH GIÁ CẢ</h3><p>Đối tác cam kết:</p><ul><li><p>🔒 Bảo mật thông tin liên quan đến khách hàng và voucher.</p></li><li><p>💰 Không tự ý tăng giá sản phẩm/dịch vụ trước khi áp dụng voucher.</p></li><li><p>🚫 Không thu thêm các khoản phí bất hợp lý ngoài quy định của chương trình.</p></li><li><p>📋 Cung cấp sản phẩm/dịch vụ đúng với nội dung đã cam kết trên voucher.</p></li></ul><hr><h1>⚠️ 4. XỬ LÝ VI PHẠM &amp; TẠM NGƯNG HỢP TÁC</h1><p>Nhằm bảo vệ quyền lợi khách hàng và duy trì chất lượng hệ thống, nền tảng có quyền <strong>tạm dừng chiến dịch, ẩn voucher hoặc khóa tài khoản Đối tác</strong> khi phát hiện các hành vi vi phạm.</p><h3>🚨 Các trường hợp có thể bị xử lý bao gồm:</h3><ul><li><p>❌ <strong>Từ chối phục vụ trái quy định:</strong> Tự ý từ chối khách hàng sở hữu voucher hợp lệ mà không có lý do chính đáng.</p></li><li><p>⚠️ <strong>Chất lượng dịch vụ không đảm bảo:</strong> Cung cấp sản phẩm/dịch vụ kém chất lượng hoặc nhận nhiều khiếu nại nghiêm trọng từ khách hàng.</p></li><li><p>🔴 <strong>Gian lận voucher:</strong> Can thiệp, làm sai lệch trạng thái voucher hoặc thực hiện hành vi gian lận trong quá trình đổi/sử dụng voucher.</p></li><li><p>⚖️ <strong>Vi phạm pháp luật:</strong> Không tuân thủ các quy định pháp luật hiện hành hoặc các điều khoản đã thỏa thuận với nền tảng.</p></li></ul><blockquote><p>🛡️ <strong>Tùy theo mức độ vi phạm</strong>, nền tảng có thể áp dụng một hoặc nhiều biện pháp: <strong>cảnh báo → tạm dừng chiến dịch → hạn chế tài khoản → khóa tài khoản → chấm dứt hợp tác</strong>.</p></blockquote><hr><h2>🌱 5. CAM KẾT ĐỒNG HÀNH CÙNG ĐỐI TÁC</h2><p>Chúng tôi hướng tới việc xây dựng một hệ sinh thái voucher <strong>minh bạch – an toàn – hiệu quả</strong>, nơi Đối tác có thể tiếp cận thêm khách hàng và phát triển doanh thu, đồng thời khách hàng nhận được những ưu đãi chất lượng.</p><blockquote><p>💙 <strong>Cùng nhau tạo nên trải nghiệm tốt hơn – Cùng nhau phát triển bền vững!</strong></p></blockquote><h3>📞 CẦN HỖ TRỢ?</h3><p>Đối tác vui lòng liên hệ <strong>Bộ phận Chăm sóc Đối tác</strong> khi cần hỗ trợ về đăng ký, phát hành voucher, đối soát hoặc xử lý vi phạm.</p><p><strong>☎️ Hotline:</strong> <code>0967456832</code><br><strong>📧 Email:</strong> <code>nkngan23@clc.fitus.edu.vn</code><br><strong>🕐 Thời gian hỗ trợ:</strong> <code>08:00 – 22:00</code> hằng ngày</p><hr><h3>✦ CẢM ƠN ĐỐI TÁC ĐÃ TIN TƯỞNG VÀ ĐỒNG HÀNH ✦</h3><p></p>',
        NULL,
        NULL,
        '2026-08-13 03:06:14.664739+00',
        '2026-08-23 17:45:05.716+00',
        '10000000-0000-0000-0000-000000000001',
        NULL
    ),
    (
        '97e24034-e4fc-4a15-a1fd-4dc83a45b7a3',
        'banner',
        'Khám Phá Thiên Đường Beach Resort – Giảm Đến 40%',
        'Dang hien thi',
        'Combo vé máy bay + khách sạn giảm đến 40%.',
        NULL,
        NULL,
        '2026-08-13 08:23:54.660072+00',
        '2026-08-24 08:41:41.37+00',
        '10000000-0000-0000-0000-000000000001',
        'https://qsbnxxkqosnoomzgjtyp.supabase.co/storage/v1/object/public/partner-documents/content/1787560820004_lkr5kl.jpg'
    ),
    (
        'b0000000-0000-0000-0000-000000000001',
        'banner',
        'Thư Giãn Trọn Vẹn – Spa & Massage Giảm 50%',
        'Dang hien thi',
        'Ưu đãi giảm giá sâu 50% rất hấp dẫn để quảng bá cho các gói combo massage, chăm sóc da mặt hoặc dịch vụ spa trọn gói.',
        '2026-07-18 09:34:18.18177+00',
        '2026-08-17 09:34:18.18177+00',
        '2026-07-16 09:34:18.18177+00',
        '2026-08-24 08:42:00.316+00',
        '10000000-0000-0000-0000-000000000001',
        'https://qsbnxxkqosnoomzgjtyp.supabase.co/storage/v1/object/public/partner-documents/content/1787560862141_ya3rs.jpg'
    ),
    (
        '08a1068b-cf4e-4c88-a2f8-222244393bc3',
        'banner',
        'Đại Tiệc Buffet Hải Sản – Mua 1 Tặng 1',
        'Dang hien thi',
        'Ưu đãi "Mua 1 Tặng 1" đại tiệc hải sản',
        NULL,
        NULL,
        '2026-08-10 19:31:31.065738+00',
        '2026-08-24 08:42:18.927+00',
        '10000000-0000-0000-0000-000000000001',
        'https://qsbnxxkqosnoomzgjtyp.supabase.co/storage/v1/object/public/partner-documents/content/1787560840101_akpbhd.jpg'
    ),
    (
        'b0000000-0000-0000-0000-000000000002',
        'bai_viet',
        'Hướng dẫn sử dụng voucher tại các chi nhánh',
        'Dang hien thi',
        '<p>Bạn vừa mua voucher thành công? Hãy làm theo các bước siêu đơn giản sau đây khi đến chi nhánh nhà hàng/cửa hàng để được áp dụng ưu đãi mượt mà nhất nhé!</p><p><strong>➡️ Bước 1: Kiểm tra Voucher trong ví ứng dụng</strong></p><ul><li><p>Mở ứng dụng thương mại điện tử của chúng tôi.</p></li><li><p>Vào mục <strong>"Đơn hàng của tôi"</strong> hoặc <strong>"Voucher của tôi"</strong>.</p></li><li><p>Chọn voucher bạn muốn sử dụng để mở sẵn <strong>Mã QR</strong> hoặc <strong>Mã Code (E-Voucher)</strong>.</p></li></ul><p><strong>➡️ Bước 2: Xuất trình mã trước khi thanh toán</strong></p><ul><li><p><strong>Thời điểm quan trọng:</strong> Hãy đưa mã voucher cho nhân viên thu ngân <strong>NGAY KHI ĐẶT MÓN (ORDER)</strong> hoặc <strong>TRƯỚC KHI IN PHIẾU KIỂM ĐỒ</strong>.</p></li><li><p><em>Lưu ý:</em> Nhà hàng sẽ từ chối áp dụng nếu hóa đơn tổng đã được in ra trước khi bạn đưa mã.</p></li></ul><p><strong>➡️ Bước 3: Thu ngân xác thực và khấu trừ</strong></p><ul><li><p>Thu ngân sẽ quét mã QR hoặc nhập mã code vào hệ thống máy POS để kiểm tra tính hợp lệ.</p></li><li><p>Hệ thống tự động trừ tiền hoặc áp dụng quà tặng trực tiếp vào hóa đơn của bạn.</p></li><li><p>Bạn chỉ cần thanh toán phần chi phí chênh lệch còn lại (nếu có).<br><br><strong>⚠️ 4 LƯU Ý QUAN TRỌNG ĐỂ TRÁNH BỊ TỪ CHỐI VOUCHER</strong></p></li></ul><ul><li><p><strong>Thời gian kích hoạt:</strong> Một số voucher "Săn Deal" hoặc "Flash Sale" cần từ <strong>1 đến 3 tiếng</strong> sau khi mua mới kích hoạt trạng thái sử dụng trên hệ thống toàn chuỗi. Bạn nên mua trước khi đến nhà hàng.</p></li><li><p><strong>Điều kiện loại trừ:</strong> Hãy đọc kỹ phần <em>Điều kiện áp dụng</em> của từng voucher về việc có áp dụng vào ngày Lễ, Tết, hoặc có được phép cộng dồn nhiều voucher trên cùng một hóa đơn hay không.</p></li><li><p><strong>Đặt bàn trước:</strong> Với các voucher buffet hoặc nhà hàng đông đúc, việc sở hữu voucher không đồng nghĩa với việc được giữ chỗ trống. Bạn vẫn nên liên hệ hotline chi nhánh để đặt bàn trước khi đến.</p></li></ul><p><br><strong>📞 BẠN GẶP SỰ CỐ KHI ĐỔI MÃ?</strong></p><p>Nếu nhân viên chi nhánh báo mã lỗi hoặc không áp dụng được, bạn vui lòng:</p><ol><li><p>Yêu cầu khiếu nại hoặc hủy đơn nếu chưa thanh toán.</p></li><li><p>Gọi ngay hotline CSKH của sàn: <strong>0967456832</strong> (Hỗ trợ từ 8:00 - 22:00 hàng ngày) hoặc gửi email của sàn: <strong>nkngan23@clc.fitus.edu.vn</strong></p></li></ol><p></p>',
        '2026-06-28 09:34:18.18177+00',
        NULL,
        '2026-06-26 09:34:18.18177+00',
        '2026-08-22 13:48:05.545+00',
        '10000000-0000-0000-0000-000000000001',
        'https://qsbnxxkqosnoomzgjtyp.supabase.co/storage/v1/object/public/partner-documents/content/1786592503099_jv2lu.jpg'
    ),
    (
        '6307e9d0-7dad-4693-ace2-e2dc4f3c7056',
        'chinh_sach',
        'Nguyên tắc áp dụng',
        'Dang hien thi',
        '<h3><strong>NGUYÊN TẮC ÁP DỤNG</strong></h3><p><strong>1. NGUYÊN TẮC CHUNG</strong></p><ul><li><p><strong>Tuân thủ:</strong> Mọi voucher được kinh doanh trên Sàn phải tuân thủ Chính sách Sàn.</p></li><li><p><strong>Chính sách riêng:</strong> Đối tác được phép khai báo chính sách hoàn/hủy riêng cho từng voucher để làm rõ:</p><ul><li><p>Thời hạn được phép hủy;</p></li><li><p>Điều kiện sử dụng;</p></li><li><p>Chi nhánh áp dụng;</p></li><li><p>Thời hạn sử dụng;</p></li><li><p>Các giới hạn riêng của chương trình.</p></li></ul></li><li><p><strong>Thứ tự ưu tiên:</strong></p><ul><li><p>Chính sách riêng của voucher không được trái với các nguyên tắc bắt buộc của Chính sách Sàn.</p></li><li><p>Trường hợp chính sách voucher không quy định một nội dung cụ thể thì áp dụng Chính sách Sàn.</p></li><li><p>Trường hợp chính sách voucher có điều khoản có lợi hơn cho Khách hàng thì được áp dụng điều khoản có lợi hơn đó.</p></li></ul></li><li><p><strong>Minh bạch:</strong> Các thông tin ảnh hưởng trực tiếp đến quyền sử dụng voucher phải được hiển thị cho Khách hàng trước khi mua.</p></li></ul><p><strong>2. CHÍNH SÁCH HỦY ĐƠN HÀNG</strong></p><p><strong>Đơn hàng chưa thanh toán thành công:</strong></p><ul><li><p>Khách hàng được phép hủy đơn nếu giao dịch chưa thanh toán thành công.</p></li><li><p>Khi hủy: Đơn hàng được ghi nhận Đã hủy; Không phát hành voucher code; Số lượng voucher đang được giữ cho giao dịch được giải phóng nếu có; Không phát sinh hoàn tiền vì chưa có giao dịch thanh toán thành công.</p><p><em>Lưu ý: Trường hợp này không cần Quản trị viên xét duyệt.</em></p></li></ul><p><strong>Đơn hàng đã thanh toán thành công:</strong></p><ul><li><p>Sau khi thanh toán thành công, Khách hàng không thể tự động hủy đơn mà phải gửi Yêu cầu hủy đơn để Sàn kiểm tra.</p></li><li><p>Yêu cầu được chấp nhận khi đồng thời đáp ứng: Giao dịch thanh toán đã thành công; Voucher code chưa được sử dụng hoặc chưa tồn tại mã hợp lệ; Đơn hàng chưa được hoàn tiền trước đó; Yêu cầu được gửi trong thời hạn cho phép hủy được công bố; Lý do hủy thuộc phạm vi được chính sách voucher hoặc Chính sách Sàn hỗ trợ.</p><p><em>Lưu ý: Nếu được chấp nhận: Yêu cầu hủy → Được chấp nhận → Đơn hàng chuyển sang Chờ hoàn tiền → tiến hành hoàn tiền. Trong thời gian chờ hoàn tiền, voucher code liên quan không được phép tiếp tục sử dụng.</em></p></li></ul><p><strong>Các trường hợp từ chối hủy đơn:</strong></p><ul><li><p>Voucher đã được sử dụng.</p></li><li><p>Đã quá thời hạn được phép hủy.</p></li><li><p>Khách hàng chỉ thay đổi ý định nhưng voucher không cho phép hủy vì lý do này.</p></li><li><p>Khách hàng không đáp ứng các điều kiện hủy đã được công bố.</p></li><li><p>Giao dịch đã được hoàn tiền trước đó.</p><p><em>Lưu ý: Khi yêu cầu bị từ chối: Đơn hàng giữ nguyên; Thanh toán giữ nguyên; Voucher code giữ nguyên; Không tạo giao dịch hoàn tiền; Khách hàng được thông báo lý do từ chối.</em></p></li></ul><p><strong>3. CHÍNH SÁCH HOÀN TIỀN</strong></p><p><strong>Nguyên tắc &amp; Điều kiện bắt buộc:</strong></p><ul><li><p>Hoàn tiền không phải là thao tác tự động ngay khi Khách hàng gửi yêu cầu. Hoàn tiền chỉ được thực hiện khi yêu cầu hủy đã được Sàn chấp nhận hoặc khiếu nại đã được xác minh đủ điều kiện hoàn tiền.</p></li><li><p>Trước khi hoàn tiền: Thanh toán gốc phải tồn tại và đã thành công; Giao dịch chưa được hoàn tiền thành công trước đó; Voucher code chưa được sử dụng; Yêu cầu xuất phát từ một quyết định hủy/khiếu nại hợp lệ; Voucher code còn khả năng sử dụng phải được vô hiệu hóa khi hoàn tiền hoàn tất.</p></li><li><p>Khi hoàn tiền thành công: Đơn hàng → Đã hoàn tiền; Hoàn tiền → Đã hoàn tiền; Voucher code chưa sử dụng → Vô hiệu hóa. Khách hàng không thể tiếp tục sử dụng voucher. <em>(Nếu quá trình hoàn tiền gặp lỗi, giao dịch chưa được xem là đã hoàn tiền).</em></p></li></ul><p><strong>Các trường hợp có thể được hoàn tiền:</strong></p><ul><li><p><strong>Trường hợp 1:</strong> Hủy đơn hợp lệ (Khách hàng yêu cầu hủy đơn đã thanh toán và đáp ứng đầy đủ điều kiện).</p></li><li><p><strong>Trường hợp 2:</strong> Không thể cung cấp voucher hợp lệ (Thanh toán thành công nhưng hệ thống không cấp được mã hợp lệ; Đã thử gửi lại/cấp lại mã nhưng không thành công).</p></li><li><p><strong>Trường hợp 3:</strong> Đối tác không thực hiện quyền lợi (Đối tác không còn cung cấp dịch vụ; Chi nhánh không còn khả năng thực hiện voucher; Đối tác từ chối voucher hợp lệ và không thể khắc phục).</p></li><li><p><strong>Trường hợp 4:</strong> Voucher không đúng nội dung đã công bố (Voucher hợp lệ nhưng không thể sử dụng đúng quyền lợi; Điều kiện thực tế của Đối tác khác với điều kiện công bố làm Khách hàng không thể sử dụng).</p></li></ul><p><strong>4. CHÍNH SÁCH KHIẾU NẠI</strong></p><p><strong>Phạm vi khiếu nại:</strong></p><p>Khách hàng có thể khiếu nại khi gặp vấn đề: Thanh toán thành công nhưng chưa nhận được mã; Mã bị lỗi/không hợp lệ; Đối tác từ chối voucher hợp lệ; Không thể sử dụng tại chi nhánh đã công bố; Quyền lợi thực tế không đúng nội dung công bố; Đối tác không còn khả năng cung cấp dịch vụ; Các lỗi khác liên quan đến giao dịch.</p><p><strong>Nguyên tắc xử lý khiếu nại (Ưu tiên khắc phục trước khi hoàn tiền):</strong></p><ul><li><p><strong>Bước 1 — Kiểm tra voucher code:</strong> Nếu Khách hàng chưa nhận được mã nhưng hệ thống đã có mã hợp lệ: Sàn gửi lại chính voucher code hiện tại. Không sinh thêm mã mới.</p></li><li><p><strong>Bước 2 — Cấp lại voucher code:</strong> Nếu chưa có mã hợp lệ hoặc mã bị lỗi, Sàn có thể cấp voucher code mới. Mã cũ phải bị vô hiệu hóa (Không tồn tại 2 mã hợp lệ cho cùng 1 quyền lợi nếu giao dịch chỉ cho phép 1 mã).</p></li><li><p><strong>Bước 3 — Xem xét hoàn tiền:</strong> Chỉ chuyển sang hoàn tiền khi: Thanh toán thành công, khiếu nại hợp lệ, voucher chưa sử dụng, không thể giải quyết bằng gửi/cấp lại mã, và nguyên nhân thuộc trường hợp được Chính sách Sàn hỗ trợ hoàn tiền.</p></li></ul><p><strong>Các trường hợp từ chối khiếu nại:</strong></p><p>Voucher đã được sử dụng; Voucher hết hạn đúng thời hạn; Sử dụng sai chi nhánh; Không đáp ứng điều kiện voucher; Không phát hiện lỗi thuộc hệ thống/Đối tác; Nội dung khiếu nại không thuộc phạm vi hỗ trợ.</p><p><strong>5. BẢNG XỬ LÝ NHANH</strong></p><p><strong>Trường hợp phát sinhHướng xử lýChưa thanh toán, Khách hàng muốn hủy</strong>Được tự hủy, không hoàn tiền<strong>Đã thanh toán, chưa sử dụng, còn điều kiện hủy</strong>Gửi yêu cầu hủy để Sàn xét duyệt<strong>Đã thanh toán nhưng Khách hàng chỉ đổi ý</strong>Không được hủy mặc định (trừ khi chính sách cho phép)<strong>Voucher đã sử dụng</strong>Không hủy / hoàn<strong>Voucher hết hạn đúng chính sách</strong>Không hoàn<strong>Khách dùng sai chi nhánh / không đúng điều kiện</strong>Không hoàn<strong>Thanh toán thành công chưa nhận mã (mã vẫn hợp lệ)</strong>Gửi lại mã cũ<strong>Mã bị lỗi hoặc không có mã hợp lệ</strong>Cấp lại mã mới<strong>Đối tác từ chối voucher hợp lệ</strong>Khiếu nại; khắc phục hoặc hoàn tiền<strong>Đối tác không còn cung cấp dịch vụ</strong>Có thể hoàn tiền nếu voucher chưa sử dụng<strong>Voucher không thể cung cấp quyền lợi đã công bố</strong>Có thể hoàn tiền<strong>Khiếu nại đủ điều kiện hoàn tiền</strong>Chuyển đơn sang Chờ hoàn tiền<strong>Hoàn tiền thành công</strong>Đơn Đã hoàn tiền, voucher code bị vô hiệu hóa</p>',
        NULL,
        NULL,
        '2026-08-23 17:24:17.663336+00',
        '2026-08-24 08:36:11.59+00',
        '10000000-0000-0000-0000-000000000102',
        NULL
    ),
    (
        '4c0bb85d-411f-408c-b7f9-15f3c434572c',
        'chinh_sach',
        'Đối tác & Sàn',
        'Dang hien thi',
        '<h3><strong>ĐỐI TÁC &amp; SÀN</strong></h3><p><strong>Đồng hành cùng Đối tác – Cùng phát triển bền vững</strong></p><p><em>Chính sách này quy định các điều khoản, quyền lợi và trách nhiệm áp dụng cho Doanh nghiệp, Thương hiệu và Nhà cung cấp khi tham gia phát hành và kinh doanh voucher.</em></p><p><strong>1. ĐIỀU KIỆN &amp; QUY TRÌNH THAM GIA</strong></p><p><strong>1.1. Điều kiện đăng ký:</strong></p><ul><li><p><strong>Tư cách kinh doanh:</strong> Là doanh nghiệp, hộ kinh doanh có giấy phép hợp lệ.</p></li><li><p><strong>Hồ sơ pháp lý:</strong> Cung cấp đầy đủ Mã số thuế, Giấy phép kinh doanh, Giấy ủy quyền (nếu có) và khai báo các chi nhánh cung cấp dịch vụ.</p></li><li><p><strong>Chất lượng:</strong> Cam kết sản phẩm/dịch vụ đúng chất lượng, đúng mô tả.</p></li><li><p><strong>Tuân thủ:</strong> Cam kết thực hiện đầy đủ quy định, thỏa thuận hợp tác và phải được Sàn phê duyệt trước khi hoạt động. Sàn có quyền từ chối/khóa Đối tác nếu hồ sơ không hợp lệ hoặc vi phạm vận hành.</p></li></ul><p><strong>1.2. Quy trình 4 bước tham gia:</strong></p><ol><li><p><strong>Đăng ký tài khoản: </strong>Tạo hồ sơ doanh nghiệp và tài khoản Đối tác trên hệ thống.</p></li><li><p><strong>Xác minh &amp; duyệt hồ sơ: </strong>Hệ thống kiểm tra, xác thực thông tin pháp lý trong 24 – 48 giờ.</p></li><li><p><strong>Tạo chiến dịch: </strong>Thiết lập mã voucher, giá bán, số lượng và thời hạn sử dụng.</p></li><li><p><strong>Phát hành &amp; quản lý: </strong>Voucher hiển thị công khai; Đối tác quản lý đơn hàng &amp; đối soát trên Dashboard.</p></li></ol><p><strong>2. MÔ HÌNH CHIẾT KHẤU &amp; THANH TOÁN</strong></p><ul><li><p><strong>Phí duy trì nền tảng:</strong> Miễn phí tạo gian hàng và niêm yết voucher.</p></li><li><p><strong>Phí hoa hồng/giao dịch:</strong> Khấu trừ trực tiếp trên mỗi voucher được khách đổi/sử dụng thành công (tỷ lệ theo hợp đồng).</p></li><li><p><strong>Chu kỳ đối soát:</strong> 02 lần/tháng (Ngày 15 và Ngày cuối tháng).</p></li><li><p><strong>Điều kiện đối soát:</strong> Các voucher có trạng thái "Đã sử dụng" (Redeemed).</p></li><li><p><strong>Thanh toán:</strong> Chuyển khoản trực tiếp vào tài khoản ngân hàng của Đối tác dự kiến trong 03 – 05 ngày làm việc kể từ ngày chốt.</p></li></ul><p><strong>3. TRÁCH NHIỆM CỦA ĐỐI TÁC KHI ĐĂNG VOUCHER</strong></p><ul><li><p><strong>Thông tin chính xác:</strong> Tên, mô tả, giá gốc, giá bán, thời gian bán/sử dụng, số lượng, chi nhánh và điều kiện sử dụng (Giá bán phải nhỏ hơn giá gốc, không bán vượt số lượng).</p></li><li><p><strong>Chính sách hoàn/hủy riêng:</strong> Được khai báo riêng nhưng không được trái Chính sách Sàn; Không được loại bỏ quyền khiếu nại của khách nếu lỗi do Đối tác.</p></li><li><p><strong>Trách nhiệm cung cấp:</strong> Không được lấy lý do “voucher không hoàn/hủy” để thoái thác trách nhiệm nếu Đối tác ngừng dịch vụ, từ chối voucher hợp lệ, quyền lợi thực tế sai công bố hoặc lỗi do Đối tác. (Điều khoản "không hoàn/hủy" chỉ áp dụng khi cung cấp đúng cam kết nhưng Khách không còn nhu cầu).</p></li></ul><p><strong>4. TRÁCH NHIỆM KHI KHÁCH HÀNG SỬ DỤNG VOUCHER</strong></p><ul><li><p><strong>Tiếp nhận &amp; Phục vụ:</strong> Phục vụ khách sử dụng voucher hợp lệ, không phân biệt đối xử so với khách thanh toán thông thường. Không từ chối voucher hợp lệ nếu khách đáp ứng đủ điều kiện.</p></li><li><p><strong>Đồng bộ trạng thái:</strong> Kiểm tra/Quét mã QR và chỉ xác nhận "Đã sử dụng" ngay tại thời điểm khách sử dụng dịch vụ. Không xác nhận lại mã đã dùng.</p></li><li><p><strong>Bảo mật &amp; Minh bạch:</strong> Bảo mật thông tin khách hàng, không tự ý tăng giá trước khi áp voucher, không thu phụ phí bất hợp lý.</p></li></ul><p>⏸️ <strong>5. VOUCHER ĐÃ BÁN KHI ĐỐI TÁC NGỪNG BÁN</strong></p><ul><li><p>Việc tạm ngưng/ngừng bán chỉ ngăn phát sinh giao dịch mới.</p></li><li><p>Voucher code đã phát hành cho Khách hàng không tự động mất hiệu lực. Đối tác vẫn phải thực hiện quyền lợi cho mã còn hợp lệ, trừ trường hợp Sàn đã chính thức hủy/vô hiệu hóa theo quy trình hoàn/hủy/khiếu nại.</p></li></ul><p><strong>6. XỬ LÝ VI PHẠM &amp; TẠM NGƯNG HỢP TÁC</strong></p><ul><li><p><strong>Phối hợp xử lý:</strong> Đối tác phải phối hợp cung cấp thông tin để Sàn xác minh khiếu nại. Nếu lỗi thuộc Đối tác và không thể khắc phục, giao dịch có thể bị chuyển sang hoàn tiền.</p></li><li><p><strong>Các hành vi vi phạm có thể bị xử lý:</strong> Từ chối phục vụ trái quy định; Chất lượng dịch vụ kém/nhận nhiều khiếu nại; Gian lận voucher (làm sai lệch trạng thái mã); Vi phạm pháp luật/thỏa thuận hợp tác.</p></li><li><p><strong>Biện pháp xử lý:</strong> Cảnh báo → Tạm dừng chiến dịch/chi nhánh → Ngừng bán voucher → Khóa tài khoản → Chấm dứt hợp tác.</p></li></ul><p><strong>7. HỖ TRỢ ĐỐI TÁC</strong></p><p>Bộ phận Chăm sóc Đối tác sẵn sàng hỗ trợ về đăng ký, phát hành, đối soát và xử lý vi phạm.</p><ul><li><p><strong>Hotline:</strong> 0967456832</p></li><li><p><strong>Email:</strong> <a target="_blank" rel="noopener noreferrer nofollow" href="mailto:nkngan23@clc.fitus.edu.vn">nkngan23@clc.fitus.edu.vn</a></p></li><li><p><strong>Thời gian hỗ trợ:</strong> 08:00 – 22:00 hằng ngày.</p><p><em>Cùng nhau tạo nên trải nghiệm tốt hơn – Cùng nhau phát triển bền vững!</em></p></li></ul><p></p>',
        NULL,
        NULL,
        '2026-08-23 17:34:55.773465+00',
        '2026-08-24 08:35:15.968+00',
        '10000000-0000-0000-0000-000000000102',
        NULL
    ),
    (
        '2127b4be-ef3c-47b8-98fe-d113d2476fe3',
        'chinh_sach',
        'Khách hàng & Sàn',
        'Dang hien thi',
        '<h3><strong>KHÁCH HÀNG &amp; SÀN</strong></h3><p><strong>1. QUYỀN CỦA KHÁCH HÀNG</strong></p><ul><li><p>Tìm kiếm và xem thông tin voucher đang được phép kinh doanh trên Sàn.</p></li><li><p>Được cung cấp đầy đủ thông tin trước khi mua, bao gồm: tên voucher, Đối tác cung cấp, giá gốc, giá bán, thời gian bán, thời hạn sử dụng, chi nhánh áp dụng, điều kiện sử dụng, chính sách hủy và hoàn tiền.</p></li><li><p>Nhận voucher code sau khi giao dịch thanh toán thành công.</p></li><li><p>Xem trạng thái đơn hàng, thanh toán và voucher đã mua.</p></li><li><p>Sử dụng voucher tại đúng Đối tác, chi nhánh và trong thời hạn được công bố.</p></li><li><p>Gửi yêu cầu hủy đối với giao dịch đáp ứng điều kiện hủy.</p></li><li><p>Gửi khiếu nại khi quyền lợi voucher không được cung cấp đúng như thông tin đã công bố.</p></li><li><p>Được gửi lại hoặc cấp lại voucher code khi lỗi phát sinh thuộc hệ thống và đáp ứng điều kiện xử lý.</p></li><li><p>Được hoàn tiền khi yêu cầu hủy hoặc khiếu nại được xác định đủ điều kiện hoàn tiền theo chính sách.</p></li></ul><p>📝 <strong>2. NGHĨA VỤ CỦA KHÁCH HÀNG</strong></p><ul><li><p>Cung cấp thông tin tài khoản chính xác.</p></li><li><p>Tự bảo vệ thông tin đăng nhập và voucher code của mình.</p></li><li><p>Kiểm tra thông tin voucher và điều kiện sử dụng trước khi thanh toán.</p></li><li><p>Sử dụng voucher: đúng thời hạn, đúng chi nhánh, đúng điều kiện, đúng phạm vi quyền lợi được công bố.</p></li><li><p>Không chuyển giao, sao chép hoặc sử dụng voucher code trái với điều kiện chương trình.</p></li><li><p>Không sử dụng lại voucher đã được ghi nhận là Đã sử dụng, trừ trường hợp voucher được thiết kế cho phép nhiều lượt sử dụng.</p></li><li><p>Cung cấp thông tin trung thực khi gửi yêu cầu hủy hoặc khiếu nại.</p></li></ul><p><strong>3. TRÁCH NHIỆM CỦA SÀN ĐỐI VỚI KHÁCH HÀNG</strong></p><ul><li><p>Chỉ cho phép voucher đã được kiểm duyệt và đủ điều kiện được đưa ra bán.</p></li><li><p>Kiểm tra khả năng cung cấp voucher tại thời điểm đặt mua và thanh toán.</p></li><li><p>Chỉ phát hành voucher code sau khi thanh toán thành công và bảo đảm mỗi mã phát hành là duy nhất.</p></li><li><p>Lưu thông tin đơn hàng, thanh toán và trạng thái voucher.</p></li><li><p>Tiếp nhận yêu cầu hủy và khiếu nại của Khách hàng.</p></li><li><p>Kiểm tra thông tin giao dịch trước khi quyết định phương án xử lý, không tự động từ chối hoặc hoàn tiền khi chưa kiểm tra.</p></li><li><p>Ghi nhận kết quả xử lý để Khách hàng có thể theo dõi.</p></li></ul><p><strong>4. CÁC TRƯỜNG HỢP SÀN KHÔNG CHỊU TRÁCH NHIỆM HOÀN TIỀN</strong> <em>Khách hàng thông thường không được hoàn tiền nếu:</em></p><ul><li><p>Voucher đã được sử dụng.</p></li><li><p>Voucher hết hạn đúng với thời hạn đã được công bố.</p></li><li><p>Khách hàng sử dụng sai chi nhánh.</p></li><li><p>Khách hàng không đáp ứng điều kiện sử dụng đã được công bố.</p></li><li><p>Khách hàng chỉ thay đổi ý định và không muốn sử dụng voucher sau khi mua, trong khi chính sách voucher không cho phép hủy vì lý do này.</p></li><li><p>Khách hàng yêu cầu hủy sau thời hạn hủy được công bố.</p></li><li><p>Không phát hiện lỗi từ Sàn hoặc Đối tác và voucher vẫn có thể được sử dụng bình thường.</p></li></ul><p></p>',
        NULL,
        NULL,
        '2026-08-23 17:34:12.804674+00',
        '2026-08-24 08:35:26.391+00',
        '10000000-0000-0000-0000-000000000102',
        NULL
    );
--
-- Data for Name: voucher_cn; Type: TABLE DATA; Schema: public; Owner: postgres
--
INSERT INTO "public"."voucher_cn" ("ma_voucher", "ma_chi_nhanh")
VALUES (
        'ce8f44d7-2193-4758-a045-eb6d96a9ef04',
        'c043a95b-f062-4ab3-8aea-f920d77b5586'
    ),
    (
        '145c7bd7-740d-4ced-9971-b73b22f341e1',
        'c043a95b-f062-4ab3-8aea-f920d77b5586'
    ),
    (
        '14ee3519-8d8a-4920-b69e-e80654f6f16e',
        '4385a7ab-71bd-4e38-be6f-020bd45e9e83'
    ),
    (
        '19e389a2-a61b-4400-a352-f521d7812f78',
        '4385a7ab-71bd-4e38-be6f-020bd45e9e83'
    ),
    (
        '2c24153a-8bcc-47c9-8f48-5f6e072e9165',
        '4385a7ab-71bd-4e38-be6f-020bd45e9e83'
    ),
    (
        '4ac941b3-ee44-4971-b04f-40cfac7e4455',
        '4385a7ab-71bd-4e38-be6f-020bd45e9e83'
    ),
    (
        '5a289e68-8f83-4575-84d2-49a182adfe75',
        '67d99e9d-67db-4a66-b6b0-ee2fb1bd5b16'
    ),
    (
        '784622c4-7150-4ced-8d8d-950c0f81e4fd',
        '67d99e9d-67db-4a66-b6b0-ee2fb1bd5b16'
    ),
    (
        '101acc9a-1e67-4060-a17c-e75f104438ae',
        '4ac4c2af-97b4-4e1a-8906-799dd168729c'
    ),
    (
        '4d75a519-4295-496b-9611-6eadb85946f0',
        '2daf1ab0-ccc9-4c8e-9074-46482bfed73d'
    ),
    (
        '1c15a1da-6aca-4165-a893-c3b2ee2b4439',
        '2daf1ab0-ccc9-4c8e-9074-46482bfed73d'
    ),
    (
        '11b33872-343b-418a-abc0-a05a1fdaa9ad',
        '2daf1ab0-ccc9-4c8e-9074-46482bfed73d'
    ),
    (
        '8270133a-ef80-4ea5-a716-cc226ce72391',
        '2daf1ab0-ccc9-4c8e-9074-46482bfed73d'
    ),
    (
        '4a8b9668-5290-4afa-aba7-edb5e310340f',
        '2daf1ab0-ccc9-4c8e-9074-46482bfed73d'
    ),
    (
        'f45b24c3-2fc6-496a-8452-16ac715829c4',
        '2daf1ab0-ccc9-4c8e-9074-46482bfed73d'
    ),
    (
        '3b29d9b4-3960-40e6-9626-deb21d9ee7b7',
        '3ca81d95-0e02-43f0-9874-c9e461c684f2'
    ),
    (
        '413fa44a-fd6d-4077-bac4-d6df32f603ca',
        '3d90d84b-d204-4513-b8de-f5d33bb39b8e'
    ),
    (
        '9a73686e-229b-43ec-b34a-77def3d1b091',
        'af3d771a-93f6-4757-a8e8-26bc5a3d4d52'
    ),
    (
        '0e0bb123-63f4-4bcc-8f8e-d4708fc3efd6',
        'ea438d89-21bf-4c6c-a3da-6edcd640a25a'
    ),
    (
        '9800abae-0f8b-4b0c-95d5-e166436a0ab3',
        'cd2c959c-72c2-4667-9436-646981ed6324'
    ),
    (
        'cc850deb-b444-4cb0-9bc5-1fda87483fd1',
        '99cd1020-4eec-42a8-8596-0f89081f268c'
    ),
    (
        'eec0c23b-4b22-4ee4-84d2-38894a98dbbe',
        '9cb249b9-8a3a-42ca-9f32-b2a2677d5202'
    ),
    (
        '5556b7f9-4f98-43b6-a421-ccc5449c2929',
        '0c18e4d3-575b-42d8-aa29-aa0588035623'
    ),
    (
        'cb0726fc-43cd-4c33-a25b-18bc5eb1c7c8',
        '13853bf1-f776-4309-9bf5-a8c1162b59bd'
    ),
    (
        '82e65301-9fe0-4cf6-b866-48a82c5250f5',
        'b01bbe8f-c041-4305-901c-ce6d71c3977a'
    ),
    (
        '7ee0406b-f97b-4d5a-86a6-c3a6fc3b3386',
        'b01bbe8f-c041-4305-901c-ce6d71c3977a'
    ),
    (
        'c20a13d7-c47e-42e9-a0a3-ba515075b1bf',
        'b01bbe8f-c041-4305-901c-ce6d71c3977a'
    ),
    (
        'fa21c7a2-e49a-4a19-a1a2-a9b75507a98c',
        'b01bbe8f-c041-4305-901c-ce6d71c3977a'
    ),
    (
        'c87130b3-062b-4fb0-bf85-21c53678e07c',
        'b01bbe8f-c041-4305-901c-ce6d71c3977a'
    ),
    (
        'f6e9d57d-04a1-42b0-bb00-5b8e66915b39',
        'bf5113ae-8d82-4bd1-9370-3be8c97f45c3'
    ),
    (
        '57001615-6abb-4958-8343-f2a1a9829327',
        '5c734a85-77ca-4b26-aa6f-0c763f527ad5'
    ),
    (
        'd630714b-591e-4a51-a6fe-770fba50ea0b',
        '5c734a85-77ca-4b26-aa6f-0c763f527ad5'
    ),
    (
        'fd22a49b-d4a9-4f91-b8c3-899adb9e1c65',
        '5c734a85-77ca-4b26-aa6f-0c763f527ad5'
    ),
    (
        '59cb3dea-5b60-40aa-8df5-472a664671c7',
        '5c734a85-77ca-4b26-aa6f-0c763f527ad5'
    ),
    (
        'fed66cbc-3cd4-4e69-b54e-7ca3eda18c93',
        '5c734a85-77ca-4b26-aa6f-0c763f527ad5'
    ),
    (
        '65a43069-7337-4ea8-ac20-0f7226a8a193',
        '5c734a85-77ca-4b26-aa6f-0c763f527ad5'
    ),
    (
        '3ff1ae81-24e5-40b7-b62c-ab0ad2ab4480',
        '5c734a85-77ca-4b26-aa6f-0c763f527ad5'
    ),
    (
        'e56f30d6-97e1-4253-8f70-19fa4a7929d9',
        '5c734a85-77ca-4b26-aa6f-0c763f527ad5'
    ),
    (
        'c2093594-5041-43cc-8e7b-96715f7e8632',
        '5c734a85-77ca-4b26-aa6f-0c763f527ad5'
    ),
    (
        '2af5fa36-e992-4aa5-b774-c4c94150b6ad',
        '5c734a85-77ca-4b26-aa6f-0c763f527ad5'
    ),
    (
        '56d560d5-f6bd-4eab-bdaa-054eee157faf',
        '5c734a85-77ca-4b26-aa6f-0c763f527ad5'
    ),
    (
        '2caaf3e1-ef7d-44f1-9063-9e6f686fcc7a',
        '5c734a85-77ca-4b26-aa6f-0c763f527ad5'
    ),
    (
        'c8eb736d-adfa-4559-881a-b85eb1641cd1',
        '5c734a85-77ca-4b26-aa6f-0c763f527ad5'
    ),
    (
        'e2ccb81e-d3bf-4c04-a98c-c040a1bf8284',
        '5c734a85-77ca-4b26-aa6f-0c763f527ad5'
    ),
    (
        'd27959cb-1ef8-4767-bc56-84b751f00837',
        '5c734a85-77ca-4b26-aa6f-0c763f527ad5'
    ),
    (
        '095bb2c0-497a-48ff-9161-bc2e8598c43a',
        '5c734a85-77ca-4b26-aa6f-0c763f527ad5'
    ),
    (
        '9171193c-e60a-4c4e-b06e-c1b4af574678',
        '5c734a85-77ca-4b26-aa6f-0c763f527ad5'
    ),
    (
        'ad44799d-889c-450d-bbbf-1271b3e321cc',
        '5c734a85-77ca-4b26-aa6f-0c763f527ad5'
    ),
    (
        'e0a5a387-4eca-495d-bc18-60e357927889',
        '54942b07-4261-4a98-8faa-493d3806019b'
    ),
    (
        'e0a5a387-4eca-495d-bc18-60e357927889',
        'f842ec56-5095-49d4-9e6a-4107fbdc1ef1'
    ),
    (
        'e0a5a387-4eca-495d-bc18-60e357927889',
        '32c0d1f9-40a5-4191-a7f8-5124c4657c54'
    ),
    (
        'e0a5a387-4eca-495d-bc18-60e357927889',
        '50a22950-f1ae-4a59-963c-e87221c056ce'
    ),
    (
        'f2e93a85-4768-4c13-9169-7f123120a523',
        '54942b07-4261-4a98-8faa-493d3806019b'
    ),
    (
        'f2e93a85-4768-4c13-9169-7f123120a523',
        'f842ec56-5095-49d4-9e6a-4107fbdc1ef1'
    ),
    (
        'f2e93a85-4768-4c13-9169-7f123120a523',
        '32c0d1f9-40a5-4191-a7f8-5124c4657c54'
    ),
    (
        'f2e93a85-4768-4c13-9169-7f123120a523',
        '50a22950-f1ae-4a59-963c-e87221c056ce'
    ),
    (
        'f002fd97-623e-470e-81a2-ac78e7e36d08',
        '54942b07-4261-4a98-8faa-493d3806019b'
    ),
    (
        'f002fd97-623e-470e-81a2-ac78e7e36d08',
        'f842ec56-5095-49d4-9e6a-4107fbdc1ef1'
    ),
    (
        'f002fd97-623e-470e-81a2-ac78e7e36d08',
        '32c0d1f9-40a5-4191-a7f8-5124c4657c54'
    ),
    (
        'f002fd97-623e-470e-81a2-ac78e7e36d08',
        '50a22950-f1ae-4a59-963c-e87221c056ce'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        '6b908e0b-4e9a-4a32-908d-f55fc24f1258'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        '3550c5e1-45e1-4d90-89ec-34966e2dd7b9'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        'd87c0f54-bbff-433f-883c-c647344f7398'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        'a6483cb2-b3f1-45c1-a47b-49b28f4c5383'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        '7f57733d-1884-4193-953b-faa801da146c'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        '96841a89-aca2-4d5e-a2b3-08f713ccce13'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        'c220ea31-ca4e-467a-9721-4d7655dabcf8'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        '62db2bfa-3a21-4dfd-88ae-55204b8c8db0'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        '908e6544-7bb0-498e-83d0-58eb663232a6'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        '707c001c-c440-4b4c-9717-e789750eda65'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        '77bf47b1-ea7d-45a8-8011-2c15a52616bf'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        '01505b30-8de8-4884-ba49-a263b5edbb76'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        '3a7e5109-9181-4569-a55b-a3fc20e27fe6'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        '9dc74bdf-32d2-48d8-a09b-44afb8606397'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        'dff77033-6f65-43ea-8119-fd47d31e27dc'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        '22caa03e-7df4-4a60-a6c2-9db1a2d25a47'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        '96037528-a8e4-44d9-86e3-687b23ceb193'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        'd9421e95-5779-475c-8f4b-c0e7402ea26a'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        '543385d1-3599-4573-9f75-177ee3aed3b3'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        'c7883925-d148-476e-8599-3c4ed3b1beb8'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        'd41fc263-11be-4e59-83e6-e37ed4315d50'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        'bc5de1e2-5077-4c0f-93c6-824ee2e8d0b5'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        '7c61f905-597a-45d4-9e60-7ae0e1669e51'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        'a4dbb326-7e5a-4516-abde-8a7cde3a1c02'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        'b4dc9b09-3ad8-4f76-ad21-7553390cda6e'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        'b1f3da2e-5496-446f-906d-ee7e0b81770a'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        '58bb7b68-cc5a-4de4-8c0b-52be3801b5f9'
    ),
    (
        'f41357e5-db70-462a-849d-b2a47240805f',
        '421b7b56-9b97-4aeb-af7b-3f2ab91b61e1'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        '6b908e0b-4e9a-4a32-908d-f55fc24f1258'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        '3550c5e1-45e1-4d90-89ec-34966e2dd7b9'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        'd87c0f54-bbff-433f-883c-c647344f7398'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        'a6483cb2-b3f1-45c1-a47b-49b28f4c5383'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        '7f57733d-1884-4193-953b-faa801da146c'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        '96841a89-aca2-4d5e-a2b3-08f713ccce13'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        'c220ea31-ca4e-467a-9721-4d7655dabcf8'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        '62db2bfa-3a21-4dfd-88ae-55204b8c8db0'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        '908e6544-7bb0-498e-83d0-58eb663232a6'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        '707c001c-c440-4b4c-9717-e789750eda65'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        '77bf47b1-ea7d-45a8-8011-2c15a52616bf'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        '01505b30-8de8-4884-ba49-a263b5edbb76'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        '3a7e5109-9181-4569-a55b-a3fc20e27fe6'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        '9dc74bdf-32d2-48d8-a09b-44afb8606397'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        'dff77033-6f65-43ea-8119-fd47d31e27dc'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        '22caa03e-7df4-4a60-a6c2-9db1a2d25a47'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        '96037528-a8e4-44d9-86e3-687b23ceb193'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        'd9421e95-5779-475c-8f4b-c0e7402ea26a'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        '543385d1-3599-4573-9f75-177ee3aed3b3'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        'c7883925-d148-476e-8599-3c4ed3b1beb8'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        'd41fc263-11be-4e59-83e6-e37ed4315d50'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        'bc5de1e2-5077-4c0f-93c6-824ee2e8d0b5'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        '7c61f905-597a-45d4-9e60-7ae0e1669e51'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        'a4dbb326-7e5a-4516-abde-8a7cde3a1c02'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        'b4dc9b09-3ad8-4f76-ad21-7553390cda6e'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        'b1f3da2e-5496-446f-906d-ee7e0b81770a'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        '58bb7b68-cc5a-4de4-8c0b-52be3801b5f9'
    ),
    (
        '3b319693-63d7-4396-ae19-73e362d61120',
        '421b7b56-9b97-4aeb-af7b-3f2ab91b61e1'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        '6b908e0b-4e9a-4a32-908d-f55fc24f1258'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        '3550c5e1-45e1-4d90-89ec-34966e2dd7b9'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        'd87c0f54-bbff-433f-883c-c647344f7398'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        'a6483cb2-b3f1-45c1-a47b-49b28f4c5383'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        '7f57733d-1884-4193-953b-faa801da146c'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        '96841a89-aca2-4d5e-a2b3-08f713ccce13'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        'c220ea31-ca4e-467a-9721-4d7655dabcf8'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        '62db2bfa-3a21-4dfd-88ae-55204b8c8db0'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        '908e6544-7bb0-498e-83d0-58eb663232a6'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        '707c001c-c440-4b4c-9717-e789750eda65'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        '77bf47b1-ea7d-45a8-8011-2c15a52616bf'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        '01505b30-8de8-4884-ba49-a263b5edbb76'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        '3a7e5109-9181-4569-a55b-a3fc20e27fe6'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        '9dc74bdf-32d2-48d8-a09b-44afb8606397'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        'dff77033-6f65-43ea-8119-fd47d31e27dc'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        '22caa03e-7df4-4a60-a6c2-9db1a2d25a47'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        '96037528-a8e4-44d9-86e3-687b23ceb193'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        'd9421e95-5779-475c-8f4b-c0e7402ea26a'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        '543385d1-3599-4573-9f75-177ee3aed3b3'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        'c7883925-d148-476e-8599-3c4ed3b1beb8'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        'd41fc263-11be-4e59-83e6-e37ed4315d50'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        'bc5de1e2-5077-4c0f-93c6-824ee2e8d0b5'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        '7c61f905-597a-45d4-9e60-7ae0e1669e51'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        'a4dbb326-7e5a-4516-abde-8a7cde3a1c02'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        'b4dc9b09-3ad8-4f76-ad21-7553390cda6e'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        'b1f3da2e-5496-446f-906d-ee7e0b81770a'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        '58bb7b68-cc5a-4de4-8c0b-52be3801b5f9'
    ),
    (
        '8d4a3b75-ff3f-4288-8800-2ce9cd014380',
        '421b7b56-9b97-4aeb-af7b-3f2ab91b61e1'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        '6b908e0b-4e9a-4a32-908d-f55fc24f1258'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        '3550c5e1-45e1-4d90-89ec-34966e2dd7b9'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        'd87c0f54-bbff-433f-883c-c647344f7398'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        'a6483cb2-b3f1-45c1-a47b-49b28f4c5383'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        '7f57733d-1884-4193-953b-faa801da146c'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        '96841a89-aca2-4d5e-a2b3-08f713ccce13'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        'c220ea31-ca4e-467a-9721-4d7655dabcf8'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        '62db2bfa-3a21-4dfd-88ae-55204b8c8db0'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        '908e6544-7bb0-498e-83d0-58eb663232a6'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        '707c001c-c440-4b4c-9717-e789750eda65'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        '77bf47b1-ea7d-45a8-8011-2c15a52616bf'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        '01505b30-8de8-4884-ba49-a263b5edbb76'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        '3a7e5109-9181-4569-a55b-a3fc20e27fe6'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        '9dc74bdf-32d2-48d8-a09b-44afb8606397'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        'dff77033-6f65-43ea-8119-fd47d31e27dc'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        '22caa03e-7df4-4a60-a6c2-9db1a2d25a47'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        '96037528-a8e4-44d9-86e3-687b23ceb193'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        'd9421e95-5779-475c-8f4b-c0e7402ea26a'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        '543385d1-3599-4573-9f75-177ee3aed3b3'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        'c7883925-d148-476e-8599-3c4ed3b1beb8'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        'd41fc263-11be-4e59-83e6-e37ed4315d50'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        'bc5de1e2-5077-4c0f-93c6-824ee2e8d0b5'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        '7c61f905-597a-45d4-9e60-7ae0e1669e51'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        'a4dbb326-7e5a-4516-abde-8a7cde3a1c02'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        'b4dc9b09-3ad8-4f76-ad21-7553390cda6e'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        'b1f3da2e-5496-446f-906d-ee7e0b81770a'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        '58bb7b68-cc5a-4de4-8c0b-52be3801b5f9'
    ),
    (
        'f6ab6b04-a084-4553-b7e4-25d7063e8460',
        '421b7b56-9b97-4aeb-af7b-3f2ab91b61e1'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        '6b908e0b-4e9a-4a32-908d-f55fc24f1258'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        '3550c5e1-45e1-4d90-89ec-34966e2dd7b9'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        'd87c0f54-bbff-433f-883c-c647344f7398'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        '908e6544-7bb0-498e-83d0-58eb663232a6'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        '707c001c-c440-4b4c-9717-e789750eda65'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        '96841a89-aca2-4d5e-a2b3-08f713ccce13'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        '7f57733d-1884-4193-953b-faa801da146c'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        'a6483cb2-b3f1-45c1-a47b-49b28f4c5383'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        'c220ea31-ca4e-467a-9721-4d7655dabcf8'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        '62db2bfa-3a21-4dfd-88ae-55204b8c8db0'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        '01505b30-8de8-4884-ba49-a263b5edbb76'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        '77bf47b1-ea7d-45a8-8011-2c15a52616bf'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        '3a7e5109-9181-4569-a55b-a3fc20e27fe6'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        '9dc74bdf-32d2-48d8-a09b-44afb8606397'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        'dff77033-6f65-43ea-8119-fd47d31e27dc'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        '22caa03e-7df4-4a60-a6c2-9db1a2d25a47'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        '96037528-a8e4-44d9-86e3-687b23ceb193'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        'd9421e95-5779-475c-8f4b-c0e7402ea26a'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        '543385d1-3599-4573-9f75-177ee3aed3b3'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        'd41fc263-11be-4e59-83e6-e37ed4315d50'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        'c7883925-d148-476e-8599-3c4ed3b1beb8'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        'bc5de1e2-5077-4c0f-93c6-824ee2e8d0b5'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        '7c61f905-597a-45d4-9e60-7ae0e1669e51'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        'a4dbb326-7e5a-4516-abde-8a7cde3a1c02'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        'b4dc9b09-3ad8-4f76-ad21-7553390cda6e'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        'b1f3da2e-5496-446f-906d-ee7e0b81770a'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        '58bb7b68-cc5a-4de4-8c0b-52be3801b5f9'
    ),
    (
        '98b8e1e9-11f1-4669-9b4d-9ca03486bb75',
        '421b7b56-9b97-4aeb-af7b-3f2ab91b61e1'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        '6b908e0b-4e9a-4a32-908d-f55fc24f1258'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        '3550c5e1-45e1-4d90-89ec-34966e2dd7b9'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        'd87c0f54-bbff-433f-883c-c647344f7398'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        'a6483cb2-b3f1-45c1-a47b-49b28f4c5383'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        '7f57733d-1884-4193-953b-faa801da146c'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        '96841a89-aca2-4d5e-a2b3-08f713ccce13'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        'c220ea31-ca4e-467a-9721-4d7655dabcf8'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        '62db2bfa-3a21-4dfd-88ae-55204b8c8db0'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        '908e6544-7bb0-498e-83d0-58eb663232a6'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        '707c001c-c440-4b4c-9717-e789750eda65'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        '77bf47b1-ea7d-45a8-8011-2c15a52616bf'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        '01505b30-8de8-4884-ba49-a263b5edbb76'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        '3a7e5109-9181-4569-a55b-a3fc20e27fe6'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        '9dc74bdf-32d2-48d8-a09b-44afb8606397'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        'dff77033-6f65-43ea-8119-fd47d31e27dc'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        '22caa03e-7df4-4a60-a6c2-9db1a2d25a47'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        '96037528-a8e4-44d9-86e3-687b23ceb193'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        'd9421e95-5779-475c-8f4b-c0e7402ea26a'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        '543385d1-3599-4573-9f75-177ee3aed3b3'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        'c7883925-d148-476e-8599-3c4ed3b1beb8'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        'd41fc263-11be-4e59-83e6-e37ed4315d50'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        'bc5de1e2-5077-4c0f-93c6-824ee2e8d0b5'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        '7c61f905-597a-45d4-9e60-7ae0e1669e51'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        'a4dbb326-7e5a-4516-abde-8a7cde3a1c02'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        'b4dc9b09-3ad8-4f76-ad21-7553390cda6e'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        'b1f3da2e-5496-446f-906d-ee7e0b81770a'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        '58bb7b68-cc5a-4de4-8c0b-52be3801b5f9'
    ),
    (
        'b334d82b-922d-4278-ad8f-ee7d12f1b04a',
        '421b7b56-9b97-4aeb-af7b-3f2ab91b61e1'
    ),
    (
        'bd418cfc-c580-4c98-889e-505c17d8e758',
        '656e341e-280d-408b-b0c4-daddfad429e7'
    ),
    (
        'bd418cfc-c580-4c98-889e-505c17d8e758',
        '89d80f0c-3920-459b-aeb4-486e4dd8dac1'
    ),
    (
        'c0d2a396-75cf-43a7-92c8-e7183b9bf0c8',
        '656e341e-280d-408b-b0c4-daddfad429e7'
    ),
    (
        'c0d2a396-75cf-43a7-92c8-e7183b9bf0c8',
        '89d80f0c-3920-459b-aeb4-486e4dd8dac1'
    ),
    (
        '59661f1c-a32d-4d4e-94d4-c59d128d7e1d',
        '656e341e-280d-408b-b0c4-daddfad429e7'
    ),
    (
        '59661f1c-a32d-4d4e-94d4-c59d128d7e1d',
        '89d80f0c-3920-459b-aeb4-486e4dd8dac1'
    ),
    (
        'd935bbcf-c6a7-4fab-89d1-42bd8bc7757b',
        '656e341e-280d-408b-b0c4-daddfad429e7'
    ),
    (
        'd935bbcf-c6a7-4fab-89d1-42bd8bc7757b',
        '89d80f0c-3920-459b-aeb4-486e4dd8dac1'
    ),
    (
        '4288e641-09fc-44cd-8ec8-cfe2b8c5fa81',
        '656e341e-280d-408b-b0c4-daddfad429e7'
    ),
    (
        '4288e641-09fc-44cd-8ec8-cfe2b8c5fa81',
        '89d80f0c-3920-459b-aeb4-486e4dd8dac1'
    ),
    (
        'd7dee7ae-db95-4ef4-b80e-e708d54dddc0',
        '656e341e-280d-408b-b0c4-daddfad429e7'
    ),
    (
        'd7dee7ae-db95-4ef4-b80e-e708d54dddc0',
        '89d80f0c-3920-459b-aeb4-486e4dd8dac1'
    ),
    (
        '36a9024d-a3a3-423d-bc9c-51652d95f726',
        '656e341e-280d-408b-b0c4-daddfad429e7'
    ),
    (
        '36a9024d-a3a3-423d-bc9c-51652d95f726',
        '89d80f0c-3920-459b-aeb4-486e4dd8dac1'
    ),
    (
        '65b47537-7516-4e0c-a8e4-1e56c1d3f171',
        '656e341e-280d-408b-b0c4-daddfad429e7'
    ),
    (
        '65b47537-7516-4e0c-a8e4-1e56c1d3f171',
        '89d80f0c-3920-459b-aeb4-486e4dd8dac1'
    ),
    (
        '8d13098f-50f1-45b4-ad34-aaedf8eb7fc6',
        'b06d0a13-2307-468f-85bd-cea2627dc564'
    ),
    (
        'ed21dec3-ff53-4f41-b369-f4fad9c4ae33',
        'b06d0a13-2307-468f-85bd-cea2627dc564'
    ),
    (
        '3da94790-34d5-4856-85e4-946f489928c8',
        'b06d0a13-2307-468f-85bd-cea2627dc564'
    ),
    (
        '6c1b11e3-93e9-4f04-ac20-87f4144d3d1f',
        '1b611a6a-c9e1-438b-be51-01358f202b2f'
    ),
    (
        '9e8740fc-f9f8-46fa-8b83-02cdba1b3baf',
        '8ad58563-6e4c-4e8b-acc8-1ba9aeaff128'
    ),
    (
        'e26ec4a8-2eb2-4d34-a3cf-e03dad20c141',
        '8a5ba525-f70d-448e-b43e-cd2d06c19cc1'
    ),
    (
        'e26ec4a8-2eb2-4d34-a3cf-e03dad20c141',
        'ea457754-0a9a-4170-82a4-10c904e104c1'
    ),
    (
        'e26ec4a8-2eb2-4d34-a3cf-e03dad20c141',
        '42617154-118b-4427-bbec-4ce3436c022a'
    ),
    (
        '63e0ea35-10a8-47af-96da-d45262567527',
        '5dff71ab-b046-4fb0-b948-45f563a32592'
    ),
    (
        'fa973101-1560-4feb-bc81-1cb962ef8485',
        '5dff71ab-b046-4fb0-b948-45f563a32592'
    ),
    (
        '5da7a165-94dd-4f0d-ad33-0d7edf13d3e8',
        '8a5ba525-f70d-448e-b43e-cd2d06c19cc1'
    ),
    (
        '5da7a165-94dd-4f0d-ad33-0d7edf13d3e8',
        'ea457754-0a9a-4170-82a4-10c904e104c1'
    ),
    (
        '5da7a165-94dd-4f0d-ad33-0d7edf13d3e8',
        '9c678f71-bbdb-479c-a1b9-fe0c116dc8ad'
    ),
    (
        '1ce33133-d1e2-48d1-97e4-8c7c847faa61',
        'd295daa0-c3e6-4398-9c45-9f53792f5e18'
    ),
    (
        '1ce33133-d1e2-48d1-97e4-8c7c847faa61',
        'f79636f0-5446-4045-9584-2b995f6fb5ae'
    ),
    (
        '1ce33133-d1e2-48d1-97e4-8c7c847faa61',
        '139f3108-4a76-4985-b6a8-9a9ec138a789'
    ),
    (
        '1ce33133-d1e2-48d1-97e4-8c7c847faa61',
        '038d3a15-f663-4a0f-95b6-18d2d8b67f99'
    ),
    (
        '1905e542-d55d-449f-bde5-e76c158c9d01',
        '64afa405-be95-4b21-903c-cb0151b03ba0'
    ),
    (
        '1905e542-d55d-449f-bde5-e76c158c9d01',
        '80c192ff-1806-4473-b7e9-b6f8baaf678b'
    ),
    (
        '1905e542-d55d-449f-bde5-e76c158c9d01',
        '038d3a15-f663-4a0f-95b6-18d2d8b67f99'
    ),
    (
        '1549fecd-90b6-40e3-9ef3-234ae1149959',
        'b47cd926-b9d9-4747-91b7-18cc12d198e6'
    ),
    (
        '0935789a-1a42-4ebd-b16d-e86266b214dc',
        '8a5ba525-f70d-448e-b43e-cd2d06c19cc1'
    ),
    (
        '0935789a-1a42-4ebd-b16d-e86266b214dc',
        '6254b323-5a50-4b9d-97b8-c4d50371d70d'
    ),
    (
        '03069af5-b8d8-4ea7-9020-d879853afff8',
        '8a5ba525-f70d-448e-b43e-cd2d06c19cc1'
    ),
    (
        '03069af5-b8d8-4ea7-9020-d879853afff8',
        'ea457754-0a9a-4170-82a4-10c904e104c1'
    ),
    (
        '03069af5-b8d8-4ea7-9020-d879853afff8',
        '5250a3e4-7bc7-46f0-bad9-690bc67ba654'
    ),
    (
        'a34f152c-d082-41ec-9f80-c1517563866e',
        '8a5ba525-f70d-448e-b43e-cd2d06c19cc1'
    ),
    (
        'a34f152c-d082-41ec-9f80-c1517563866e',
        'ea457754-0a9a-4170-82a4-10c904e104c1'
    ),
    (
        'a34f152c-d082-41ec-9f80-c1517563866e',
        'ea09404d-2543-476d-a69e-8ae77e16d5b1'
    ),
    (
        'daf2341c-dcdf-4ed6-9423-680141a66b6d',
        '8a5ba525-f70d-448e-b43e-cd2d06c19cc1'
    ),
    (
        'daf2341c-dcdf-4ed6-9423-680141a66b6d',
        'ea457754-0a9a-4170-82a4-10c904e104c1'
    ),
    (
        'daf2341c-dcdf-4ed6-9423-680141a66b6d',
        '833dabdd-a07c-40af-bfc0-919f903421ee'
    ),
    (
        '477cbad4-f4a2-4319-81be-3ef0b3696e44',
        '935e330a-a7bd-4307-aec3-256f94832085'
    ),
    (
        '8cd00220-82f0-4099-8d85-329ac748ae31',
        '8a5ba525-f70d-448e-b43e-cd2d06c19cc1'
    ),
    (
        '8cd00220-82f0-4099-8d85-329ac748ae31',
        'ea457754-0a9a-4170-82a4-10c904e104c1'
    ),
    (
        '8cd00220-82f0-4099-8d85-329ac748ae31',
        'aee99873-c94d-45c1-a952-0b038e24d5d6'
    ),
    (
        'e9a94e52-4b38-4255-b3da-35e376666334',
        '935e330a-a7bd-4307-aec3-256f94832085'
    ),
    (
        'e9a94e52-4b38-4255-b3da-35e376666334',
        '8a5ba525-f70d-448e-b43e-cd2d06c19cc1'
    ),
    (
        'e9a94e52-4b38-4255-b3da-35e376666334',
        'ea457754-0a9a-4170-82a4-10c904e104c1'
    ),
    (
        'e9a94e52-4b38-4255-b3da-35e376666334',
        '5250a3e4-7bc7-46f0-bad9-690bc67ba654'
    ),
    (
        'dbe3bd91-a779-44ce-8b37-818feef0f382',
        'c8395dd8-e715-4bd4-ba7b-263661a1a0d9'
    ),
    (
        'af6ee141-6164-4732-964b-c7fe68cf97d1',
        '8a5ba525-f70d-448e-b43e-cd2d06c19cc1'
    ),
    (
        'af6ee141-6164-4732-964b-c7fe68cf97d1',
        'ea457754-0a9a-4170-82a4-10c904e104c1'
    ),
    (
        'af6ee141-6164-4732-964b-c7fe68cf97d1',
        'a9364e8e-1560-4bf4-b0a4-55185a5b2591'
    ),
    (
        'c4939bd9-5786-4df1-84ba-bde62c747236',
        '8a5ba525-f70d-448e-b43e-cd2d06c19cc1'
    ),
    (
        'c4939bd9-5786-4df1-84ba-bde62c747236',
        'ea457754-0a9a-4170-82a4-10c904e104c1'
    ),
    (
        'c4939bd9-5786-4df1-84ba-bde62c747236',
        'ba8df534-7d17-4696-95b9-c486281560b0'
    ),
    (
        '43278c13-6018-46cd-9b7b-e9494e7a7ee9',
        'bd1a7fce-0295-45ee-b4ef-d256b8b14573'
    ),
    (
        '43278c13-6018-46cd-9b7b-e9494e7a7ee9',
        'f7d719ee-6eac-4ffe-bfdd-2bd1a758a588'
    ),
    (
        '43278c13-6018-46cd-9b7b-e9494e7a7ee9',
        'dae599ce-6e24-4c8b-88a8-e7e2cab68256'
    ),
    (
        'ffae9e53-0aa0-4d5d-9fb0-30243fba35a9',
        '61c7ad52-a1ff-4446-80fd-3a8b4ac66381'
    ),
    (
        'ffae9e53-0aa0-4d5d-9fb0-30243fba35a9',
        'c8a89575-0f9c-487c-a580-b4851ba1ab0c'
    ),
    (
        'be44b7d9-26ad-46cc-a4fe-c9f79e833e08',
        '61c7ad52-a1ff-4446-80fd-3a8b4ac66381'
    ),
    (
        'be44b7d9-26ad-46cc-a4fe-c9f79e833e08',
        'c8a89575-0f9c-487c-a580-b4851ba1ab0c'
    ),
    (
        '3be64879-c4f7-4d23-8524-fa70a0ba515f',
        '4c793256-9529-4596-a0ea-52b4eb9c691d'
    ),
    (
        '3be64879-c4f7-4d23-8524-fa70a0ba515f',
        '168a25a0-24c7-44a4-a996-6f3f9fc86738'
    ),
    (
        '4e1cc348-8c38-4f4b-802f-b35e684bc5c8',
        '8ad58563-6e4c-4e8b-acc8-1ba9aeaff128'
    );
--
-- Data for Name: yeu_cau_cap_nhat_chinhanh; Type: TABLE DATA; Schema: public; Owner: postgres
--
INSERT INTO "public"."yeu_cau_cap_nhat_chinhanh" (
        "ma_yc",
        "ma_chi_nhanh",
        "loai_yeu_cau",
        "ten_chi_nhanh_moi",
        "khu_vuc_moi",
        "dia_chi_moi",
        "trang_thai",
        "ly_do_tu_choi",
        "ngay_yeu_cau",
        "nguoi_duyet",
        "ngay_duyet"
    )
VALUES (
        '3bad1e67-910c-4841-ba69-8b66c394c6dd',
        '30000000-0000-0000-0000-000000000002',
        'CAP_NHAT',
        'Am Thuc Sai Gon Tần',
        'Q2',
        '120 Vo Van Tan, TP. Ho Chi Minh',
        'Tu choi',
        'Sửa lại tên hopej lệ',
        '2026-08-12 14:51:13.598+00',
        '00000000-0000-0000-0000-000000000001',
        '2026-08-12 14:55:13.283+00'
    );
--
-- Data for Name: yeu_cau_cap_nhat_hosodn; Type: TABLE DATA; Schema: public; Owner: postgres
--
INSERT INTO "public"."yeu_cau_cap_nhat_hosodn" (
        "ma_yc",
        "ma_hs",
        "ten_dn_moi",
        "ma_so_thue_moi",
        "dia_chi_moi",
        "giay_phep_kinh_doanh_moi",
        "ho_ten_nguoi_dai_dien_moi",
        "sdt_nguoi_dai_dien_moi",
        "email_nguoi_dai_dien_moi",
        "cccd_moi",
        "trang_thai",
        "ly_do_tu_choi",
        "ngay_yeu_cau",
        "nguoi_duyet",
        "ngay_duyet",
        "ngay_sinh",
        "gioi_tinh",
        "logo_new"
    )
VALUES (
        '186bf8be-5ad0-4399-881f-182830796376',
        '20000000-0000-0000-0000-000000000001',
        'Cong ty TNHH Am Thuc Sai Gon',
        '0310000001',
        '12 Nguyen Hue, TP. Ho Chi Minh',
        NULL,
        'Pham Hoang Anh Khoa',
        '0900000011',
        'owner.amthuc@ec.local',
        '079088000011',
        'Da duyet',
        NULL,
        '2026-08-07 14:52:38.38+00',
        NULL,
        '2026-08-07 15:03:46.336+00',
        NULL,
        NULL,
        NULL
    ),
    (
        '68d0511e-e249-4fd3-b0e7-5bb119afb794',
        '20000000-0000-0000-0000-000000000001',
        'CÔNG TY ĐÃ DUYỆT TÊN MỚI 100%',
        NULL,
        '999 Đường Nguyễn Huệ, Q1, TPHCM',
        NULL,
        'Trần Văn Đại Diện Mới',
        NULL,
        NULL,
        NULL,
        'Da duyet',
        NULL,
        '2026-08-07 17:11:33.397+00',
        NULL,
        '2026-08-07 17:12:12.446+00',
        NULL,
        NULL,
        NULL
    ),
    (
        'f424e2dd-6508-47f1-924e-b133be0c8ccb',
        '20000000-0000-0000-0000-000000000001',
        'Ẩm Thực An Nhiên',
        '0310000001',
        '999 Đường Nguyễn Huệ, Q1, TPHCM',
        NULL,
        'Phạm Hoàng Mỹ Anh',
        '0900000011',
        'owner.amthuc@ec.local',
        '079088000011',
        'Da duyet',
        NULL,
        '2026-08-07 17:17:09.916+00',
        NULL,
        '2026-08-07 17:19:09.682+00',
        NULL,
        NULL,
        NULL
    ),
    (
        'a04d9b85-1499-4fa8-8b1f-a27199359860',
        '20000000-0000-0000-0000-000000000001',
        'Ẩm Thực An Nhiên',
        '0310000001',
        '12 Đường Nguyễn Huệ, Q1, TPHCM',
        NULL,
        'Phạm Hoàng Mỹ Ngọc ',
        '0900000011',
        'owner.amthuc@ec.local',
        '079088000011',
        'Da duyet',
        NULL,
        '2026-08-08 04:58:52.996+00',
        NULL,
        '2026-08-08 05:02:37.879+00',
        NULL,
        NULL,
        NULL
    ),
    (
        '5d9df147-531a-47df-81ea-14b242910835',
        '20000000-0000-0000-0000-000000000001',
        'Ẩm Thực An Nhiên',
        '0310000001',
        '12 Đường Nguyễn Huệ, Q1, TPHCM',
        NULL,
        'Nguyễn Ngọc Linh',
        '0905670011',
        'nnl.amthuc@ec.local',
        '07908800022',
        'Da duyet',
        NULL,
        '2026-08-08 05:54:55.495+00',
        NULL,
        '2026-08-08 06:18:50.885+00',
        NULL,
        NULL,
        NULL
    ),
    (
        'fef1c61d-fc6b-48a1-9eb7-aae3f99aacdb',
        '20000000-0000-0000-0000-000000000001',
        'CÔNG TY TEST CÓ NGÀY SINH & GIỚI TÍNH',
        NULL,
        NULL,
        NULL,
        'Phạm Hoàng Mỹ Anh Mới',
        NULL,
        NULL,
        NULL,
        'Da duyet',
        NULL,
        '2026-08-08 06:33:08.378+00',
        NULL,
        '2026-08-08 06:33:12.183+00',
        '1990-05-20',
        'Nữ',
        NULL
    ),
    (
        'a16b6b7b-1af6-42a5-a2a6-dc715ae1e3e2',
        '20000000-0000-0000-0000-000000000001',
        'CÔNG TY TEST CÓ NGÀY SINH & GIỚI TÍNH 2026',
        NULL,
        NULL,
        NULL,
        'Phạm Hoàng Mỹ Anh Mới',
        NULL,
        NULL,
        NULL,
        'Da duyet',
        NULL,
        '2026-08-08 06:34:17.387+00',
        NULL,
        '2026-08-08 06:34:20.129+00',
        '1992-08-15',
        'Nữ',
        NULL
    ),
    (
        '5f8318cd-9b99-4d01-93d2-1b89bf097e6f',
        '20000000-0000-0000-0000-000000000001',
        'Ẩm Thực An ',
        '0310000001',
        '13 Đường Nguyễn Huệ, Q1, TPHCM',
        NULL,
        'Phạm Hoàng Mỹ Ánh',
        '0905670000',
        'nnln.amthuc@ec.local',
        '07908800011',
        'Da duyet',
        NULL,
        '2026-08-08 06:37:49.785+00',
        NULL,
        '2026-08-08 06:40:45.152+00',
        '1977-08-15',
        'Nam',
        NULL
    ),
    (
        '4b69a2ee-5e39-4419-ab1c-0d29ab37a5b7',
        '20000000-0000-0000-0000-000000000001',
        'Test Corp Schema Sync',
        NULL,
        NULL,
        NULL,
        'Nguyen Van A',
        NULL,
        NULL,
        NULL,
        'Da duyet',
        NULL,
        '2026-08-08 17:14:04.752+00',
        '00000000-0000-0000-0000-000000000001',
        '2026-08-08 17:14:05.793+00',
        NULL,
        NULL,
        NULL
    ),
    (
        '74dbf4a8-b5c6-4a57-8904-6900daad3033',
        '20000000-0000-0000-0000-000000000001',
        'Test Corp Schema Sync',
        NULL,
        NULL,
        NULL,
        'Nguyen Van A',
        NULL,
        NULL,
        NULL,
        'Da duyet',
        NULL,
        '2026-08-08 17:14:24.041+00',
        '00000000-0000-0000-0000-000000000001',
        '2026-08-10 16:58:14.722+00',
        NULL,
        NULL,
        NULL
    ),
    (
        'caba20fe-b9c1-4a40-8842-b0c897d995a2',
        '20000000-0000-0000-0000-000000000001',
        'Ẩm thực bốn phương',
        '0310000001',
        '13 Đường Nguyễn Huệ, Q1, TPHCM',
        'https://qsbnxxkqosnoomzgjtyp.supabase.co/storage/v1/object/public/partner-documents/licenses/1786420314893_sd0fuh.png',
        'Nguyễn Thị Bạch Tuyết',
        '0905670067',
        'nnln.amthuc@ec.local',
        '07908800067',
        'Da duyet',
        NULL,
        '2026-08-11 03:51:56.521+00',
        '00000000-0000-0000-0000-000000000001',
        '2026-08-11 04:11:48.523+00',
        '1977-08-15',
        'Nu',
        NULL
    ),
    (
        '69f7d598-f259-4f2e-87c0-c2e244200b32',
        '20000000-0000-0000-0000-000000000001',
        'Ẩm thực bốn phương',
        '0310000001',
        '13 Đường Nguyễn Huệ, Q1, TPHCM',
        'https://qsbnxxkqosnoomzgjtyp.supabase.co/storage/v1/object/public/partner-documents/licenses/1786420314893_sd0fuh.png',
        'Nguyễn Thị Bạch Tuyết',
        '09056aaa',
        'nnln.amthuc@ec.local',
        '07908800067',
        'Da duyet',
        NULL,
        '2026-08-12 12:54:48.638+00',
        '00000000-0000-0000-0000-000000000001',
        '2026-08-12 14:54:23.885+00',
        '1977-08-15',
        'Nu',
        NULL
    ),
    (
        '855e32b4-c084-4343-a5cc-fedbf103ad6f',
        '20000000-0000-0000-0000-000000000001',
        'Ẩm Thực Bốn Phương',
        '0310000001',
        '133/A Đường Nguyễn Huệ, Q1, TPHCM',
        'https://qsbnxxkqosnoomzgjtyp.supabase.co/storage/v1/object/public/partner-documents/licenses/1786626559125_6rk2ic.jpg',
        'Nguyễn Ngọc Hương',
        '0905600001',
        'nnhh.amthuc@ec.local',
        '079088000671',
        'Da duyet',
        NULL,
        '2026-08-13 13:09:20.795+00',
        '00000000-0000-0000-0000-000000000001',
        '2026-08-14 09:39:57.328+00',
        '1988-08-15',
        'Nu',
        'https://qsbnxxkqosnoomzgjtyp.supabase.co/storage/v1/object/public/partner-documents/logos/1786626560253_imprmu.png'
    ),
    (
        '344514df-a28e-4a28-b32b-7350e0f6f8ce',
        '20000000-0000-0000-0000-000000000001',
        'Ẩm Thực Bốn Phương',
        '0310000001',
        '133/A Đường Nguyễn Huệ, Q1, TPHCM',
        'https://qsbnxxkqosnoomzgjtyp.supabase.co/storage/v1/object/public/partner-documents/licenses/1786626559125_6rk2ic.jpg',
        'Nguyễn Ngọc Hương Linh',
        '0905600001',
        'nnhh.amthuc@ec.local',
        '079023333334',
        'Da duyet',
        NULL,
        '2026-08-21 05:49:38.843+00',
        '00000000-0000-0000-0000-000000000001',
        '2026-08-22 03:46:48.637+00',
        '1988-08-15',
        'Nu',
        'https://qsbnxxkqosnoomzgjtyp.supabase.co/storage/v1/object/public/partner-documents/logos/1786626560253_imprmu.png'
    );
--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--
INSERT INTO "storage"."buckets" (
        "id",
        "name",
        "owner",
        "created_at",
        "updated_at",
        "public",
        "avif_autodetection",
        "file_size_limit",
        "allowed_mime_types",
        "owner_id",
        "type",
        "versioning_status"
    )
VALUES (
        'partner-documents',
        'partner-documents',
        NULL,
        '2026-08-08 08:54:04.711983+00',
        '2026-08-08 08:54:04.711983+00',
        true,
        false,
        NULL,
        NULL,
        NULL,
        'STANDARD',
        'DISABLED'
    );
--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--
--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--
--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--
INSERT INTO "storage"."objects" (
        "id",
        "bucket_id",
        "name",
        "owner",
        "created_at",
        "updated_at",
        "last_accessed_at",
        "metadata",
        "version",
        "owner_id",
        "user_metadata",
        "archived_at",
        "is_delete_marker",
        "is_versioned"
    )
VALUES (
        '681559cd-e724-4db9-91bc-4a614006db15',
        'partner-documents',
        'licenses/test_1786179250167.png',
        NULL,
        '2026-08-08 08:54:10.589133+00',
        '2026-08-08 08:54:10.589133+00',
        '2026-08-08 08:54:10.589133+00',
        '{"eTag": "\"f829b914fc47cfc9c0747c119c27cf1b\"", "size": 70, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-08-08T08:54:11.000Z", "contentLength": 70, "httpStatusCode": 200}',
        '3741d29c-c032-46a6-bf23-c4ce1d48126e',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        'ffcb6310-4cc7-450a-bd99-645486b853c8',
        'partner-documents',
        'licenses/1786179569534_npkuru.jpg',
        NULL,
        '2026-08-08 08:59:30.181913+00',
        '2026-08-08 08:59:30.181913+00',
        '2026-08-08 08:59:30.181913+00',
        '{"eTag": "\"7298e6a7f00d000e22456c9977085835\"", "size": 97049, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-08T08:59:31.000Z", "contentLength": 97049, "httpStatusCode": 200}',
        'f9fe118a-6e8a-4d50-ba02-58b1112f7ca3',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        'ec9bca6f-c3e7-4fa6-9f9a-a583efc5feac',
        'partner-documents',
        'licenses/1786212765224_dt602x.jpg',
        NULL,
        '2026-08-08 18:12:46.562829+00',
        '2026-08-08 18:12:46.562829+00',
        '2026-08-08 18:12:46.562829+00',
        '{"eTag": "\"6e003c04fd7a879f1bfeba60a207ebc6\"", "size": 176635, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-08T18:12:47.000Z", "contentLength": 176635, "httpStatusCode": 200}',
        '15abdbc4-e635-4c27-a41a-739fc3bfdce7',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '13924a30-e5db-46cd-876c-ffbe8bc54a08',
        'partner-documents',
        'licenses/1786254922699_m396x.jpg',
        NULL,
        '2026-08-09 05:55:23.810445+00',
        '2026-08-09 05:55:23.810445+00',
        '2026-08-09 05:55:23.810445+00',
        '{"eTag": "\"ad57c151659c7157560332f3faf8ad57\"", "size": 41136, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-09T05:55:24.000Z", "contentLength": 41136, "httpStatusCode": 200}',
        'c60b008b-5c1b-47f6-be4d-9c524e891855',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '1749cdb0-08ea-47d8-afd6-9ceb03fb0ca2',
        'partner-documents',
        'licenses/1786255342146_ljpi04.jpg',
        NULL,
        '2026-08-09 06:02:23.784717+00',
        '2026-08-09 06:02:23.784717+00',
        '2026-08-09 06:02:23.784717+00',
        '{"eTag": "\"ad57c151659c7157560332f3faf8ad57\"", "size": 41136, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-09T06:02:24.000Z", "contentLength": 41136, "httpStatusCode": 200}',
        'f38ed7ce-f04d-4cb3-9b1e-5c4cd6033219',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '71e4f31c-1052-4201-a92b-1920881dd9f7',
        'partner-documents',
        'licenses/1786285745967_f35yyh.jpg',
        NULL,
        '2026-08-09 14:29:07.19702+00',
        '2026-08-09 14:29:07.19702+00',
        '2026-08-09 14:29:07.19702+00',
        '{"eTag": "\"b593220f53cb5baa20676cb251f83c87\"", "size": 109376, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-09T14:29:08.000Z", "contentLength": 109376, "httpStatusCode": 200}',
        '087a90b8-271e-4e06-bbdb-1f0173e33685',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        'df9ffa6b-fe7f-4d8e-8e68-427ad75e6e27',
        'partner-documents',
        'licenses/1786380422005_7yz3.jpg',
        NULL,
        '2026-08-10 16:47:02.865915+00',
        '2026-08-10 16:47:02.865915+00',
        '2026-08-10 16:47:02.865915+00',
        '{"eTag": "\"f4d3bb74e1db4e4ed23ba965a054acf6\"", "size": 106311, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-10T16:47:03.000Z", "contentLength": 106311, "httpStatusCode": 200}',
        'ec20a415-a2a2-483c-be12-56b9c28cb9f9',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '23de34e2-ee40-425a-9209-253cdf4c812d',
        'partner-documents',
        'licenses/1786420314893_sd0fuh.png',
        NULL,
        '2026-08-11 03:51:56.916513+00',
        '2026-08-11 03:51:56.916513+00',
        '2026-08-11 03:51:56.916513+00',
        '{"eTag": "\"b1170d956a7f5667a83f6edac80fcda4\"", "size": 566684, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-08-11T03:51:57.000Z", "contentLength": 566684, "httpStatusCode": 200}',
        '725e7c57-40cd-4479-af8e-e4aaa040403d',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '20e73def-570e-4420-b242-ea011d7c733a',
        'partner-documents',
        'licenses/1786420923983_ojnzk.pdf',
        NULL,
        '2026-08-11 04:02:05.671196+00',
        '2026-08-11 04:02:05.671196+00',
        '2026-08-11 04:02:05.671196+00',
        '{"eTag": "\"cda44306aac82dd25ee56dfd08e8f82c\"", "size": 262625, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-08-11T04:02:06.000Z", "contentLength": 262625, "httpStatusCode": 200}',
        '0f14e780-fd7a-4fa8-bbe6-bd6a359e1234',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '3a816ce6-8723-49f8-b25c-aec28197c222',
        'partner-documents',
        'content/.emptyFolderPlaceholder',
        NULL,
        '2026-08-11 04:40:31.838573+00',
        '2026-08-13 02:22:52.45382+00',
        '2026-08-11 04:40:31.838573+00',
        '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2026-08-13T02:22:53.000Z", "contentLength": 0, "httpStatusCode": 200}',
        '83bf3a89-47c4-4fd9-b498-a322fcf236af',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '70344afc-16dd-4988-9cd4-ee80f0fc24d9',
        'partner-documents',
        'content/1786589688355_gu3nhm.jpg',
        NULL,
        '2026-08-13 02:54:49.3151+00',
        '2026-08-13 02:54:49.3151+00',
        '2026-08-13 02:54:49.3151+00',
        '{"eTag": "\"320709ce1bfa68ea8cc06861835bb80c\"", "size": 36339, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-13T02:54:50.000Z", "contentLength": 36339, "httpStatusCode": 200}',
        'ab7d2f83-d1ad-4c03-a833-510c604af52f',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '508c3c24-0389-4c44-ae27-303296755657',
        'partner-documents',
        'content/1786589695251_9mj81.jpg',
        NULL,
        '2026-08-13 02:54:56.097506+00',
        '2026-08-13 02:54:56.097506+00',
        '2026-08-13 02:54:56.097506+00',
        '{"eTag": "\"331ab19707fd8689a1c7fef0c58736ea\"", "size": 47483, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-13T02:54:57.000Z", "contentLength": 47483, "httpStatusCode": 200}',
        '19ca910a-fe0a-4dd0-9031-b2e7bf7000be',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '9a9eab91-1060-421a-8c6f-41d7c5f320d6',
        'partner-documents',
        'content/1786589762671_ooiui.jpg',
        NULL,
        '2026-08-13 02:56:03.597324+00',
        '2026-08-13 02:56:03.597324+00',
        '2026-08-13 02:56:03.597324+00',
        '{"eTag": "\"5367f3983665e2fddd29a4c7e9909c3f\"", "size": 48206, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-13T02:56:04.000Z", "contentLength": 48206, "httpStatusCode": 200}',
        'fa911554-fa97-44f2-b8db-115d14291a5a',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '4a3dee79-e642-464f-82a6-80ff2055fe3e',
        'partner-documents',
        'content/1786591593746_lqtqz.jpg',
        NULL,
        '2026-08-13 03:26:34.686325+00',
        '2026-08-13 03:26:34.686325+00',
        '2026-08-13 03:26:34.686325+00',
        '{"eTag": "\"d22c7c0f4e637155513d7f0fcfdce6c0\"", "size": 44441, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-13T03:26:35.000Z", "contentLength": 44441, "httpStatusCode": 200}',
        '03e198f1-23b3-40fe-9230-852b47b16927',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '7f0d5238-fe6f-47c6-8b23-01c1eeb0d759',
        'partner-documents',
        'content/1786592166107_yxc5t8.jpg',
        NULL,
        '2026-08-13 03:36:07.30354+00',
        '2026-08-13 03:36:07.30354+00',
        '2026-08-13 03:36:07.30354+00',
        '{"eTag": "\"cf6109cb2f40cca70f90f02f0dc345ad\"", "size": 5564, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-13T03:36:08.000Z", "contentLength": 5564, "httpStatusCode": 200}',
        '5cf37ddb-98cf-4289-9af6-05c131ad7f2a',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '2a2448d9-4354-46aa-8070-bdd2b0f362ff',
        'partner-documents',
        'content/1786592503099_jv2lu.jpg',
        NULL,
        '2026-08-13 03:41:44.392465+00',
        '2026-08-13 03:41:44.392465+00',
        '2026-08-13 03:41:44.392465+00',
        '{"eTag": "\"9fe16c6c7d6c19176a7814320f91d06c\"", "size": 80159, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-13T03:41:45.000Z", "contentLength": 80159, "httpStatusCode": 200}',
        'd7b4bfd7-f2c5-43fa-8980-a653faf0b876',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '42878896-d880-43da-82a1-2d54d632d33f',
        'partner-documents',
        'licenses/1786626559125_6rk2ic.jpg',
        NULL,
        '2026-08-13 13:09:20.182971+00',
        '2026-08-13 13:09:20.182971+00',
        '2026-08-13 13:09:20.182971+00',
        '{"eTag": "\"e201ea8590b238d5769f4af0a1566592\"", "size": 57833, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-13T13:09:21.000Z", "contentLength": 57833, "httpStatusCode": 200}',
        'dd3f514c-6db8-4ce4-8226-57d45c129f4f',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        'ef557063-2044-4842-8964-5c68215930b2',
        'partner-documents',
        'logos/1786626560253_imprmu.png',
        NULL,
        '2026-08-13 13:09:20.716661+00',
        '2026-08-13 13:09:20.716661+00',
        '2026-08-13 13:09:20.716661+00',
        '{"eTag": "\"022d4efc33cffb948ad0967123e8d3da\"", "size": 9154, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-08-13T13:09:21.000Z", "contentLength": 9154, "httpStatusCode": 200}',
        '442a6825-8a89-4941-b3be-5f73eeb9a1d8',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '4fc85975-8ce7-4060-b1a9-3625f82355c3',
        'partner-documents',
        'licenses/1786630501401_hr0fvl.png',
        NULL,
        '2026-08-13 14:15:02.451381+00',
        '2026-08-13 14:15:02.451381+00',
        '2026-08-13 14:15:02.451381+00',
        '{"eTag": "\"29a74d1d47a1d4c7081f9a3be1c3670a\"", "size": 12408, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-08-13T14:15:03.000Z", "contentLength": 12408, "httpStatusCode": 200}',
        'f61237f4-cdef-4aeb-b1f2-d0be4f8be4a0',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '0ad841bc-5987-40d9-98c3-ab7360574a03',
        'partner-documents',
        'logos/1786630502482_8d6faf.jpg',
        NULL,
        '2026-08-13 14:15:02.764432+00',
        '2026-08-13 14:15:02.764432+00',
        '2026-08-13 14:15:02.764432+00',
        '{"eTag": "\"01d6d9bcd7eb6ade27dc7a4a9dc050a8\"", "size": 20604, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-13T14:15:03.000Z", "contentLength": 20604, "httpStatusCode": 200}',
        '9e0706e6-888f-4176-8c73-4c713c6bf9ec',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '76631c92-c40a-4f57-9d82-3c108c0e9d41',
        'partner-documents',
        'logos/1786630895847_vtfdej.png',
        NULL,
        '2026-08-13 14:21:37.188836+00',
        '2026-08-13 14:21:37.188836+00',
        '2026-08-13 14:21:37.188836+00',
        '{"eTag": "\"a18bd6dbc0eb94f6e9d9cdb83e220c68\"", "size": 11252, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-08-13T14:21:38.000Z", "contentLength": 11252, "httpStatusCode": 200}',
        '4b1f4d62-6e7c-441c-92d6-f907000e537e',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '5cdb9108-91f3-4c88-8662-3b47c7ce0980',
        'partner-documents',
        'licenses/1786720434591_iih36j.jpg',
        NULL,
        '2026-08-14 15:13:55.632607+00',
        '2026-08-14 15:13:55.632607+00',
        '2026-08-14 15:13:55.632607+00',
        '{"eTag": "\"e201ea8590b238d5769f4af0a1566592\"", "size": 57833, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-14T15:13:56.000Z", "contentLength": 57833, "httpStatusCode": 200}',
        '504740d7-2e4f-4316-84f7-07abc9a8a1f9',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        'a4901dbc-8dad-465c-b2b4-0f4ee8cfa8b2',
        'partner-documents',
        'logos/1786720435735_e4yc38.jpg',
        NULL,
        '2026-08-14 15:13:56.656316+00',
        '2026-08-14 15:13:56.656316+00',
        '2026-08-14 15:13:56.656316+00',
        '{"eTag": "\"6003745f142e1056f6083804e29b83ea\"", "size": 6618, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-14T15:13:57.000Z", "contentLength": 6618, "httpStatusCode": 200}',
        '9ac249fd-d7b8-4c73-8fce-ef7854e33f22',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '5bdbcff0-6a14-42d2-a87d-f7962d45b32a',
        'partner-documents',
        'logos/1786895184722_dmkjgl.jpg',
        NULL,
        '2026-08-16 15:46:25.51142+00',
        '2026-08-16 15:46:25.51142+00',
        '2026-08-16 15:46:25.51142+00',
        '{"eTag": "\"e3f15195a2d01e046a791da85fc5f41e\"", "size": 39257, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-16T15:46:26.000Z", "contentLength": 39257, "httpStatusCode": 200}',
        'e61123eb-011a-463d-8ece-1af27b0f994e',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        'b0d31a54-c003-40cc-8af4-6ed9e27d167c',
        'partner-documents',
        'licenses/1787310001013_bshov4.jpg',
        NULL,
        '2026-08-21 11:00:02.782178+00',
        '2026-08-21 11:00:02.782178+00',
        '2026-08-21 11:00:02.782178+00',
        '{"eTag": "\"abf0e60b22a4794a941242c100d2b9b8\"", "size": 38036, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-21T11:00:03.000Z", "contentLength": 38036, "httpStatusCode": 200}',
        '30cfb055-b361-4637-aede-f9bc41bd6c30',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        'b72ea5ae-e756-48d5-9e12-a64fe29c2f9d',
        'partner-documents',
        'logos/1787310002828_fuzer6.png',
        NULL,
        '2026-08-21 11:00:03.442786+00',
        '2026-08-21 11:00:03.442786+00',
        '2026-08-21 11:00:03.442786+00',
        '{"eTag": "\"ac3ff54bfc77f9f199d864e52dfc20a1\"", "size": 8778, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-08-21T11:00:04.000Z", "contentLength": 8778, "httpStatusCode": 200}',
        '26ff579a-4bff-4a55-baea-da88ba4e72b4',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '3ef3b412-ef78-4fde-90c1-b7dff9565fae',
        'partner-documents',
        'licenses/1787311426681_2glhbp.jpg',
        NULL,
        '2026-08-21 11:23:47.23041+00',
        '2026-08-21 11:23:47.23041+00',
        '2026-08-21 11:23:47.23041+00',
        '{"eTag": "\"030828dd3ea390b9531162d227318cba\"", "size": 40415, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-21T11:23:48.000Z", "contentLength": 40415, "httpStatusCode": 200}',
        '6639a314-9bff-4767-9cb5-6b6b648796ca',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '4eb89575-ecb1-412b-a469-f9eba3a791c1',
        'partner-documents',
        'logos/1787311427340_2kohuj.png',
        NULL,
        '2026-08-21 11:23:47.769593+00',
        '2026-08-21 11:23:47.769593+00',
        '2026-08-21 11:23:47.769593+00',
        '{"eTag": "\"3da1a79fab18deed496cbf7fa10febfd\"", "size": 10912, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-08-21T11:23:48.000Z", "contentLength": 10912, "httpStatusCode": 200}',
        '3c6ad805-b1f1-4fec-9221-4b724ef9f570',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '15a71f06-7ee5-48ae-ba5c-9e77d4e5bd88',
        'partner-documents',
        'licenses/1787314331605_h80vtb.jpg',
        NULL,
        '2026-08-21 12:12:12.124943+00',
        '2026-08-21 12:12:12.124943+00',
        '2026-08-21 12:12:12.124943+00',
        '{"eTag": "\"8fa32b0608177abf12d4260ff58855ee\"", "size": 7142, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-21T12:12:13.000Z", "contentLength": 7142, "httpStatusCode": 200}',
        'b3c5fe30-9d0b-4503-8858-e0cac01798a1',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        'cede3496-945d-4714-9f69-25bc02003be9',
        'partner-documents',
        'logos/1787314332285_paezoj.jpg',
        NULL,
        '2026-08-21 12:12:12.485934+00',
        '2026-08-21 12:12:12.485934+00',
        '2026-08-21 12:12:12.485934+00',
        '{"eTag": "\"0065e65a1c71bad2cf664411a2e0f24a\"", "size": 16454, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-21T12:12:13.000Z", "contentLength": 16454, "httpStatusCode": 200}',
        '7e2b9e7b-ebd2-4073-b263-d065bc75f57c',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '0e066342-d27d-4c18-b54d-e37a6bb4506e',
        'partner-documents',
        'licenses/1787371644212_9d7kkn.png',
        NULL,
        '2026-08-22 04:07:26.717144+00',
        '2026-08-22 04:07:26.717144+00',
        '2026-08-22 04:07:26.717144+00',
        '{"eTag": "\"cf9586e967eac6104fd22313d55fd585\"", "size": 1359254, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-08-22T04:07:27.000Z", "contentLength": 1359254, "httpStatusCode": 200}',
        '6b3e9e36-640d-4e87-bacf-c169d9189b2a',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '172e897f-6e5c-459f-a862-023cbaf80b5d',
        'partner-documents',
        'content/1787505020264_yzerz.jpg',
        NULL,
        '2026-08-23 17:10:22.241027+00',
        '2026-08-23 17:10:22.241027+00',
        '2026-08-23 17:10:22.241027+00',
        '{"eTag": "\"01534bffe7f09d8805268f0afebc2d74\"", "size": 83540, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-23T17:10:23.000Z", "contentLength": 83540, "httpStatusCode": 200}',
        'a4225d0c-656d-4cca-a8dd-8f1c73c916fd',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '2ca9149d-1fee-4ee1-a77c-56165969f108',
        'partner-documents',
        'content/1787560820004_lkr5kl.jpg',
        NULL,
        '2026-08-24 08:40:24.836149+00',
        '2026-08-24 08:40:24.836149+00',
        '2026-08-24 08:40:24.836149+00',
        '{"eTag": "\"e5f68e6431616f418542535f27e00581\"", "size": 78045, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-24T08:40:25.000Z", "contentLength": 78045, "httpStatusCode": 200}',
        '60de8091-37e4-4e2c-8070-ae1819c89d2f',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '88b87951-7a65-469e-974a-3af2bdb3e3a5',
        'partner-documents',
        'content/1787560840101_akpbhd.jpg',
        NULL,
        '2026-08-24 08:40:44.018749+00',
        '2026-08-24 08:40:44.018749+00',
        '2026-08-24 08:40:44.018749+00',
        '{"eTag": "\"597a9b00c0a9a57ff8909013f03a1d80\"", "size": 88825, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-24T08:40:44.000Z", "contentLength": 88825, "httpStatusCode": 200}',
        '1fd2d70f-0d1a-4a02-bb57-39aa9c55ae15',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '7ef9d867-111e-473d-af86-ab06b6e41572',
        'partner-documents',
        'content/1787560862141_ya3rs.jpg',
        NULL,
        '2026-08-24 08:41:06.309314+00',
        '2026-08-24 08:41:06.309314+00',
        '2026-08-24 08:41:06.309314+00',
        '{"eTag": "\"f5f5fa91f055985855bd20334353d2c4\"", "size": 39690, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-24T08:41:07.000Z", "contentLength": 39690, "httpStatusCode": 200}',
        'c911fa04-7dfc-4230-a107-ff1ac257023c',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '53ffb93e-fea0-46dc-b44f-cc34d78c9e57',
        'partner-documents',
        'content/1787561119679_kc0jsl.jpg',
        NULL,
        '2026-08-24 08:45:23.659398+00',
        '2026-08-24 08:45:23.659398+00',
        '2026-08-24 08:45:23.659398+00',
        '{"eTag": "\"9609a47478d3016b3cc0ed36e9c7fdd8\"", "size": 75858, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-24T08:45:24.000Z", "contentLength": 75858, "httpStatusCode": 200}',
        '86dcb507-6e25-446e-86d7-116f1f81fb2b',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '1969a58e-3ffb-4fca-ba21-a098ab68a5f5',
        'partner-documents',
        'content/1787561161836_r558oc.jpg',
        NULL,
        '2026-08-24 08:46:05.748058+00',
        '2026-08-24 08:46:05.748058+00',
        '2026-08-24 08:46:05.748058+00',
        '{"eTag": "\"ebfe82914cd5f674e5b361b0eb08f8e5\"", "size": 54848, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-24T08:46:06.000Z", "contentLength": 54848, "httpStatusCode": 200}',
        '9a6db105-2b17-4526-9512-062da7093810',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '5a646a7a-7035-43fd-ada9-815ada26a531',
        'partner-documents',
        'categories/1787643258818_zs6y4o.jpg',
        NULL,
        '2026-08-25 07:34:19.809171+00',
        '2026-08-25 07:34:19.809171+00',
        '2026-08-25 07:34:19.809171+00',
        '{"eTag": "\"ce27b3043568a5c9fc8132c764ad6ba4\"", "size": 40233, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-25T07:34:20.000Z", "contentLength": 40233, "httpStatusCode": 200}',
        '1769f601-970e-4994-8dd9-ccdc558389d1',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '00f61dd8-cf0e-4d6f-a882-2d553f4d8502',
        'partner-documents',
        'categories/1787643511810_lqsokm.jpg',
        NULL,
        '2026-08-25 07:38:32.96406+00',
        '2026-08-25 07:38:32.96406+00',
        '2026-08-25 07:38:32.96406+00',
        '{"eTag": "\"0ee7ce8602c0b8af9b507230285e65b2\"", "size": 25664, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-25T07:38:33.000Z", "contentLength": 25664, "httpStatusCode": 200}',
        '3fccd941-5780-4434-9007-52b43a20f1db',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '3f902ea8-c0e1-446f-bd14-ccc98da51df1',
        'partner-documents',
        'categories/1787643520159_5r8mak.jpg',
        NULL,
        '2026-08-25 07:38:40.895848+00',
        '2026-08-25 07:38:40.895848+00',
        '2026-08-25 07:38:40.895848+00',
        '{"eTag": "\"425177ece26f3079e7fbbead9c078e5c\"", "size": 17936, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-25T07:38:41.000Z", "contentLength": 17936, "httpStatusCode": 200}',
        '307211b4-a644-40cc-9d0c-eb96fd5d48fc',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        '132743c6-1f0c-4ac5-b308-ebd95dfb924a',
        'partner-documents',
        'categories/1787643526357_bv4nu.jpg',
        NULL,
        '2026-08-25 07:38:47.104793+00',
        '2026-08-25 07:38:47.104793+00',
        '2026-08-25 07:38:47.104793+00',
        '{"eTag": "\"ecf67b3265f926a34614621b260d4e08\"", "size": 16781, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-25T07:38:48.000Z", "contentLength": 16781, "httpStatusCode": 200}',
        '82211182-8111-4e5c-94b0-866f736f5963',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        'dead5688-8413-4a0d-aabe-1106d1e7c2eb',
        'partner-documents',
        'categories/1787643532451_s3sdzc.jpg',
        NULL,
        '2026-08-25 07:38:53.199982+00',
        '2026-08-25 07:38:53.199982+00',
        '2026-08-25 07:38:53.199982+00',
        '{"eTag": "\"8b151f648edf58e0dc15a4cc92aca8ea\"", "size": 17481, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-25T07:38:54.000Z", "contentLength": 17481, "httpStatusCode": 200}',
        '4de77e13-3ba1-4e2d-a19a-8327d3ecbd36',
        NULL,
        '{}',
        NULL,
        false,
        false
    ),
    (
        'cae08e92-da96-4bc2-a395-5035cf5e9380',
        'partner-documents',
        'categories/1787643539754_5b0rd5.jpg',
        NULL,
        '2026-08-25 07:39:00.494955+00',
        '2026-08-25 07:39:00.494955+00',
        '2026-08-25 07:39:00.494955+00',
        '{"eTag": "\"8d7217e584bfc3ee1d170662d96a1d07\"", "size": 18643, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-08-25T07:39:01.000Z", "contentLength": 18643, "httpStatusCode": 200}',
        'a795a547-494c-4f22-b75b-b76d506f449a',
        NULL,
        '{}',
        NULL,
        false,
        false
    );
--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--
--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--
--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--
--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--
SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);
--
-- PostgreSQL database dump complete
--
-- \unrestrict sZvPsDAvoNsxLey7jeZlpWu3s4tlmKjXp63fhHHIcBOvr1ZRAy2nhRVBGjy6Rpq
RESET ALL;