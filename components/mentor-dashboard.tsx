"use client"

import { TopMentorCard } from "./top-mentor-card"
import { MentorsList } from "./mentors-list"
import { Stats } from "./stats"
import { useState, useEffect } from "react"
import { fetchMentors, fetchStudents, fetchCohorts } from "@/lib/api"

/* Define the data shape */
type Mentor = {
  id: number
  name: string
  students: number
  specialty: string
  image: string
}

type Student = {
  id: number
  name: string
  grade: number | null
  cohort_id: number | null
}

type Cohort = {
  id: number
  name: string
  start_date: string
  end_date: string
  mentor_id: number | null
}

export function MentorDashboard() {
  /* Proper state */
  const [mentorsData, setMentorsData] = useState<Mentor[]>([]) 
  const [students, setStudents] = useState<Student[]>([])
  const [cohorts, setCohorts] = useState<Cohort[]>([])
  
  /* Fetch + store data */
  useEffect(() => {
  Promise.all([fetchMentors(), fetchStudents(), fetchCohorts()])
      .then(([mentors, students, cohorts]) => {
        setMentorsData(mentors)
        setStudents(students)
        setCohorts(cohorts)
      })
      .catch(console.error)
  }, [])

  /* Derived values (inside component) */
  const topFive = mentorsData
    .map(mentor => ({
      ...mentor,
      studentsCount: students.filter(
        s => cohorts.find(c => c.id === s.cohort_id)?.mentor_id === mentor.id
      ).length
    }))
    .sort((a, b) => b.studentsCount - a.studentsCount)
    .slice(0, 5)

  const totalStudents = students.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <span className="text-2xl">🎉</span>
            <span className="text-sm font-semibold text-primary">
              10 Year Anniversary
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            Celebrating Our Top Mentors
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Recognizing excellence in mentorship at Moringa School
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Stats
          totalStudents={totalStudents}
          totalMentors={mentorsData.length}
        />

        {/* Top 5 */}
        <section className="mb-12">
          <h2 className="mb-2 text-2xl font-bold">Top 5 Mentors</h2>
          <p className="mb-6 text-muted-foreground">
            Our most dedicated mentors
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {topFive.map((mentor, index) => (
              <TopMentorCard
                key={mentor.id}
                mentor={mentor}
                rank={index + 1}
              />
            ))}
          </div>
        </section>

        {/* All mentors */}
        <section>
          <h2 className="mb-2 text-2xl font-bold">All Mentors</h2>
          <p className="mb-6 text-muted-foreground">
            Complete list of mentors
          </p>

          <MentorsList mentors={mentorsData} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8 text-center text-sm text-muted-foreground">
        © 2026 Moringa School. Celebrating 10 years of excellence.
      </footer>
    </div>
  )
}
