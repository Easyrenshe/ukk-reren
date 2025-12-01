--
-- PostgreSQL database dump
--

\restrict gcMx5ZAV59YFiIC86dUsME1TRmsIllDSDQ9NWWtbxh4zhEIaN9KleinUF3lktPq

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-12-01 20:44:43

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

DROP DATABASE IF EXISTS hms;
--
-- TOC entry 4984 (class 1262 OID 17751)
-- Name: hms; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE hms WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';


ALTER DATABASE hms OWNER TO postgres;

\unrestrict gcMx5ZAV59YFiIC86dUsME1TRmsIllDSDQ9NWWtbxh4zhEIaN9KleinUF3lktPq
\connect hms
\restrict gcMx5ZAV59YFiIC86dUsME1TRmsIllDSDQ9NWWtbxh4zhEIaN9KleinUF3lktPq

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

--
-- TOC entry 2 (class 3079 OID 19070)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 4985 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 19136)
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    guest_id uuid,
    room_id uuid,
    check_in date NOT NULL,
    check_out date NOT NULL,
    total_price numeric(12,2),
    status character varying(20) DEFAULT 'pending'::character varying,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 19126)
-- Name: guests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.guests (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    full_name character varying(150) NOT NULL,
    phone character varying(20),
    email character varying(100),
    address text,
    id_type character varying(50),
    id_number character varying(50),
    nationality character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.guests OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 19157)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    booking_id uuid,
    amount numeric(12,2) NOT NULL,
    payment_method character varying(50),
    payment_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'pending'::character varying,
    transaction_id character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 19097)
-- Name: room_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.room_types (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    capacity integer DEFAULT 2,
    amenities text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    image_url text
);


ALTER TABLE public.room_types OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 19110)
-- Name: rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rooms (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    room_number character varying(50) NOT NULL,
    type_id uuid,
    status character varying(20) DEFAULT 'available'::character varying,
    floor integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.rooms OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 19081)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(100) NOT NULL,
    full_name character varying(150),
    role character varying(50) DEFAULT 'staff'::character varying,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 4977 (class 0 OID 19136)
-- Dependencies: 222
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.bookings VALUES ('a0f3354e-0126-48d5-ad1a-7c6e692e29a9', '0cdac716-f9d4-42c5-9e51-3c6c2a22ddf8', 'dd9aaa55-c168-4523-a660-7c4a7f4b58f6', '2025-11-20', '2025-11-22', 1200000.00, 'confirmed', 'Extended stay', '2025-11-20 22:07:57.798251', '2025-11-20 22:07:57.798251');
INSERT INTO public.bookings VALUES ('416403d1-1844-43d3-907c-9f8041616d68', '0cdac716-f9d4-42c5-9e51-3c6c2a22ddf8', '3d67f4f8-afd0-48c5-8a11-7ed4ff9f19ad', '2025-11-01', '2025-11-30', 1200000.00, 'checked-in', NULL, '2025-11-20 23:07:03.581364', '2025-11-20 23:07:03.581364');
INSERT INTO public.bookings VALUES ('30596873-19f2-4ae6-b29d-37eb37ef69db', 'fa52603e-fe23-4b16-b0ce-687c2dec7141', '397ac4b6-2110-4e01-b0cb-d1a5e0a7a3eb', '2025-11-16', '2025-11-21', 5000000.00, 'checked-out', NULL, '2025-11-20 23:12:38.450348', '2025-11-20 23:12:38.450348');
INSERT INTO public.bookings VALUES ('1de9a0c5-03fd-4a45-9648-ca2a50ce66ab', '0cdac716-f9d4-42c5-9e51-3c6c2a22ddf8', '79cf3ab9-a4c7-41cd-a5db-cbfeaa8de726', '2025-11-20', '2025-11-30', 1200000.00, 'cancelled', NULL, '2025-11-20 23:13:32.038609', '2025-11-20 23:13:32.038609');
INSERT INTO public.bookings VALUES ('9159cb22-76c7-4870-b5e8-50ec141a9001', 'fa52603e-fe23-4b16-b0ce-687c2dec7141', '9fb85905-8c34-4ec7-a60b-77460e1c6e8b', '2025-11-18', '2025-11-21', 2000000.00, 'pending', 'Business trip', '2025-11-20 22:07:57.798251', '2025-11-20 22:07:57.798251');


--
-- TOC entry 4976 (class 0 OID 19126)
-- Dependencies: 221
-- Data for Name: guests; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.guests VALUES ('fa52603e-fe23-4b16-b0ce-687c2dec7141', 'Razaan', '083456789012', 'razaan@example.com', 'Cempaka', 'passport', 'B987654321', 'Indonesia', '2025-11-20 22:07:57.798251', '2025-11-20 22:07:57.798251');
INSERT INTO public.guests VALUES ('0cdac716-f9d4-42c5-9e51-3c6c2a22ddf8', 'Reren', '082345678901', 'reren@example.com', 'Garut Kota', 'sim', '123456789', 'Indonesia', '2025-11-20 22:07:57.798251', '2025-11-20 22:07:57.798251');


--
-- TOC entry 4978 (class 0 OID 19157)
-- Dependencies: 223
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.payments VALUES ('64ae9df4-d477-4362-b375-cdec8880d538', '30596873-19f2-4ae6-b29d-37eb37ef69db', 5000000.00, 'cash', '2025-11-20 23:19:50.483481', 'completed', 'TNX001', '2025-11-20 23:19:50.483481', '2025-11-20 23:19:50.483481');
INSERT INTO public.payments VALUES ('dd7a0399-e11b-46e3-bb94-18246e3cb7bd', '1de9a0c5-03fd-4a45-9648-ca2a50ce66ab', 1200000.00, 'credit_card', '2025-11-20 23:20:37.91226', 'failed', 'TNX002', '2025-11-20 23:20:37.91226', '2025-11-20 23:20:37.91226');


--
-- TOC entry 4974 (class 0 OID 19097)
-- Dependencies: 219
-- Data for Name: room_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.room_types VALUES ('ac1c704f-061a-4878-bac9-8bfbcf20cb3a', 'Deluxe Room', 'Ruangan mewah dengan pemandangan kota', 750000.00, 2, 'TV 42 inch, AC, WiFi, Mini Bar, Balkon', '2025-11-20 22:07:57.798251', '2025-11-20 22:07:57.798251', 'https://i.pinimg.com/1200x/13/20/a1/1320a1168ef321224ebfadce0b7d9466.jpg');
INSERT INTO public.room_types VALUES ('ce1428f6-7cdb-413c-9317-58302d97e90f', 'Standard Room', 'Ruangan standar dengan fasilitas dasar', 500000.00, 2, 'TV, AC, WiFi, Kamar Mandi Pribadi', '2025-11-20 22:07:57.798251', '2025-11-20 22:07:57.798251', 'https://i.pinimg.com/736x/b6/ee/fb/b6eefbe7484bab49a485a94f0ba53839.jpg');
INSERT INTO public.room_types VALUES ('8dcf3c83-f206-4464-9e20-538e5bdf01cc', 'Presidential Suite', 'Ruangan suite presiden dengan fasilitas lengkap', 1500000.00, 6, 'TV 65 inch, AC, WiFi, Hot Tub, Dining Area', '2025-11-20 22:07:57.798251', '2025-11-20 22:07:57.798251', 'https://i.pinimg.com/736x/53/e7/95/53e79552d9de0edd8b38dd0dedfd6d3d.jpg');
INSERT INTO public.room_types VALUES ('5a4b1fbb-76aa-4c75-b9f4-675d44c998ce', 'Suite Room', 'Ruangan suite dengan area living terpisah', 1000000.00, 4, 'TV 50 inch, AC, WiFi, Mini Bar, Jacuzzi', '2025-11-20 22:07:57.798251', '2025-11-20 22:07:57.798251', 'https://i.pinimg.com/736x/22/18/4d/22184d22b4ea5819d81c01a448154d7b.jpg');
INSERT INTO public.room_types VALUES ('00f47cda-f3e0-4d5a-925e-bf8532632bc9', 'Family Room', 'Ruangan keluarga dengan ruang luas', 850000.00, 4, 'TV, AC, WiFi, 2 Kamar Mandi, Dapur Mini', '2025-11-20 22:07:57.798251', '2025-11-20 22:07:57.798251', 'https://i.pinimg.com/736x/d5/18/e0/d518e0fce49140fd95a51a9933608f47.jpg');


--
-- TOC entry 4975 (class 0 OID 19110)
-- Dependencies: 220
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rooms VALUES ('3d67f4f8-afd0-48c5-8a11-7ed4ff9f19ad', '701', '8dcf3c83-f206-4464-9e20-538e5bdf01cc', 'occupied', 7, '2025-11-20 23:10:15.51878', '2025-11-20 23:10:15.51878');
INSERT INTO public.rooms VALUES ('dd9aaa55-c168-4523-a660-7c4a7f4b58f6', '401', 'ac1c704f-061a-4878-bac9-8bfbcf20cb3a', 'available', 4, '2025-11-20 23:09:35.183784', '2025-11-20 23:09:35.183784');
INSERT INTO public.rooms VALUES ('9fb85905-8c34-4ec7-a60b-77460e1c6e8b', '301', 'ce1428f6-7cdb-413c-9317-58302d97e90f', 'booked', 3, '2025-11-20 22:07:57.798251', '2025-11-20 22:07:57.798251');
INSERT INTO public.rooms VALUES ('79cf3ab9-a4c7-41cd-a5db-cbfeaa8de726', '601', '00f47cda-f3e0-4d5a-925e-bf8532632bc9', 'available', 6, '2025-11-20 23:10:01.255549', '2025-11-20 23:10:01.255549');
INSERT INTO public.rooms VALUES ('397ac4b6-2110-4e01-b0cb-d1a5e0a7a3eb', '501', '5a4b1fbb-76aa-4c75-b9f4-675d44c998ce', 'maintenance', 5, '2025-11-20 23:09:46.973515', '2025-11-20 23:09:46.973515');


--
-- TOC entry 4973 (class 0 OID 19081)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES ('708edee3-0836-442a-8251-50448f733951', 'admin', '$2b$10$RwiU2eyuG/8W3mPOrT6UFep0F2N7k31lU6CYLAi13KCnK7vkpyyBO', 'admin@hotel.com', 'Admin User', 'admin', true, '2025-11-20 22:07:57.798251', '2025-11-20 22:07:57.798251');
INSERT INTO public.users VALUES ('63bb0702-baac-4e52-9f1a-6d778fe96e9a', 'staff', '$2b$10$fZdzDyULZImv1XBgSEUfF.xQBjNUD2iYp1pT82ayEXCCsu00QuGtS', 'staff@hotel.com', 'Staff User', 'staff', true, '2025-11-21 08:16:13.903433', '2025-11-21 08:16:13.903433');
INSERT INTO public.users VALUES ('7ab48374-b6a1-4c19-88d0-ca287be4ff22', 'manager', '$2b$10$cQgKNHYrCx/wo3lkzn3XKOZq56TesKdYiCbOgj6wA6.VK6CWyYspC', 'manager@hotel.com', 'Manager User', 'manager', true, '2025-11-21 08:16:14.054435', '2025-11-21 08:16:14.054435');


--
-- TOC entry 4816 (class 2606 OID 19146)
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- TOC entry 4814 (class 2606 OID 19135)
-- Name: guests guests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guests
    ADD CONSTRAINT guests_pkey PRIMARY KEY (id);


--
-- TOC entry 4823 (class 2606 OID 19166)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 4805 (class 2606 OID 19109)
-- Name: room_types room_types_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_types
    ADD CONSTRAINT room_types_name_key UNIQUE (name);


--
-- TOC entry 4807 (class 2606 OID 19107)
-- Name: room_types room_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room_types
    ADD CONSTRAINT room_types_pkey PRIMARY KEY (id);


--
-- TOC entry 4810 (class 2606 OID 19118)
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- TOC entry 4812 (class 2606 OID 19120)
-- Name: rooms rooms_room_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_room_number_key UNIQUE (room_number);


--
-- TOC entry 4799 (class 2606 OID 19096)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4801 (class 2606 OID 19092)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4803 (class 2606 OID 19094)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4817 (class 1259 OID 19175)
-- Name: idx_bookings_check_in; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_check_in ON public.bookings USING btree (check_in);


--
-- TOC entry 4818 (class 1259 OID 19176)
-- Name: idx_bookings_check_out; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_check_out ON public.bookings USING btree (check_out);


--
-- TOC entry 4819 (class 1259 OID 19173)
-- Name: idx_bookings_guest_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_guest_id ON public.bookings USING btree (guest_id);


--
-- TOC entry 4820 (class 1259 OID 19174)
-- Name: idx_bookings_room_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_room_id ON public.bookings USING btree (room_id);


--
-- TOC entry 4821 (class 1259 OID 19177)
-- Name: idx_payments_booking_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_booking_id ON public.payments USING btree (booking_id);


--
-- TOC entry 4808 (class 1259 OID 19172)
-- Name: idx_rooms_type_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rooms_type_id ON public.rooms USING btree (type_id);


--
-- TOC entry 4797 (class 1259 OID 19178)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 4825 (class 2606 OID 19147)
-- Name: bookings bookings_guest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_guest_id_fkey FOREIGN KEY (guest_id) REFERENCES public.guests(id) ON DELETE CASCADE;


--
-- TOC entry 4826 (class 2606 OID 19152)
-- Name: bookings bookings_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE SET NULL;


--
-- TOC entry 4827 (class 2606 OID 19167)
-- Name: payments payments_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- TOC entry 4824 (class 2606 OID 19121)
-- Name: rooms rooms_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.room_types(id) ON DELETE SET NULL;


-- Completed on 2025-12-01 20:44:43

--
-- PostgreSQL database dump complete
--

\unrestrict gcMx5ZAV59YFiIC86dUsME1TRmsIllDSDQ9NWWtbxh4zhEIaN9KleinUF3lktPq

