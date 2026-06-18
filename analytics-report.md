# Analytics Report

## Overview

The analytics layer converts saved interviews and ATS reports into progress signals suitable for a SaaS-style interview preparation platform.

## Implemented Metrics

- Total interviews
- Average score
- Best score
- Latest score
- Improvement percentage from first to latest interview
- Interview streak
- Total ATS reports
- Average ATS score
- Interview score trend
- ATS score trend
- Weekly progress
- Monthly progress
- Role-based progress
- Skill growth analytics
- Strong skill areas
- Weak skill areas

## Skill Coverage

The skill growth model tracks:

- React
- JavaScript
- Node.js
- Express.js
- MongoDB
- Communication
- Problem Solving
- Confidence

Technical skills are derived from ATS keyword matches and interview history. Communication, problem solving, and confidence are derived from evaluation feedback.

## Backend Endpoint

`GET /api/history/analytics`

The endpoint returns a structured payload with `summary`, `trends`, `skillGrowth`, `strongSkillAreas`, and `weakSkillAreas`.

## Product Value

These analytics help candidates identify weak areas, track improvement over time, and demonstrate measurable learning progress during a college project demo or recruiter portfolio walkthrough.
