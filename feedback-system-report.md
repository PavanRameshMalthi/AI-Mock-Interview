# Feedback System Report

## Overview

The feedback system has been rebuilt around actionable interview coaching rather than a single generic score. It combines deterministic local evaluation with optional Gemini scoring and stores the final enriched result in interview history.

## Implemented Feedback Dimensions

- Overall score
- Technical accuracy
- Communication
- Problem solving
- Confidence
- Relevance
- Completeness
- Strengths
- Weaknesses
- Improvement suggestions
- Study topics
- Mistakes made
- Weak topics
- Learning recommendations
- Areas to improve

## Question-Level Feedback

Each question can include:

- Question text
- Candidate answer
- Score
- AI/local feedback
- What was correct
- What was missing or incorrect
- Why the answer is wrong
- Correct answer
- Improvement suggestion
- Study topics

## Reliability Design

The platform does not depend entirely on an external AI provider. If Gemini is unavailable, the local evaluation engine still scores answers, detects weak signals, produces expected answers, and generates improvement recommendations.

## Persistence

Feedback is saved inside the `Interview` model so the history deep view, results page, analytics dashboard, PDF report, and certificate workflow can use the same evaluation record.
