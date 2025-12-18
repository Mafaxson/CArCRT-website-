-- Supabase SQL schema for all admin sections
-- Run this in your Supabase SQL editor to create the required tables

-- Stats
create table if not exists stats (
  id serial primary key,
  community_members integer,
  projects integer,
  districts integer
);
insert into stats (community_members, projects, districts) select 0,0,0 where not exists (select 1 from stats);

-- Partners
create table if not exists partners (
  id serial primary key,
  name text,
  type text, -- Partner, Sponsor, Affiliate
  logo text,
  website text
);

-- Coaching Partners
create table if not exists coaching_partners (
  id serial primary key,
  name text,
  logo text,
  website text
);

-- Affiliates
create table if not exists affiliates (
  id serial primary key,
  name text,
  logo text,
  website text
);

-- Gallery
create table if not exists gallery (
  id serial primary key,
  title text,
  image_url text,
  description text
);

-- Awards
create table if not exists awards (
  id serial primary key,
  title text,
  description text,
  date date
);

-- Certificates
create table if not exists certificates (
  id serial primary key,
  title text,
  description text,
  date date
);

-- Leadership
create table if not exists leadership (
  id serial primary key,
  name text,
  title text,
  bio text,
  photo text,
  type text -- Leadership, Team, Intern
);

-- Programs
create table if not exists programs (
  id serial primary key,
  title text,
  description text,
  image text
);

-- News
create table if not exists news (
  id serial primary key,
  title text,
  content text,
  date date,
  category text,
  featured boolean
);

-- Events
create table if not exists events (
  id serial primary key,
  title text,
  date date,
  location text,
  description text
);



