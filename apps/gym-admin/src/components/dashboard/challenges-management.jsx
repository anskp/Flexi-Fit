import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Target, Users, Calendar, Trophy, TrendingUp } from "lucide-react"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

const challenges = [
  {
    id: 1,
    name: "30-Day Fitness Challenge",
    description: "Complete 30 days of consistent workouts",
    category: "Consistency",
    status: "Active",
    participants: 2847,
    maxParticipants: 5000,
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    progress: 75,
    rewards: "Exclusive badge + 500 points",
    difficulty: "Medium",
    icon: "🏃",
    color: "from-green-400 to-blue-500"
  },
  {
    id: 2,
    name: "Strength Training Pro",
    description: "Master all major compound lifts",
    category: "Strength",
    status: "Active",
    participants: 156,
    maxParticipants: 200,
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    progress: 45,
    rewards: "Strength Master badge + 1000 points",
    difficulty: "Hard",
    icon: "💪",
    color: "from-red-400 to-red-600"
  },
  {
    id: 3,
    name: "Cardio Master",
    description: "Complete 100 miles of cardio",
    category: "Cardio",
    status: "Upcoming",
    participants: 89,
    maxParticipants: 150,
    startDate: "2024-02-01",
    endDate: "2024-02-29",
    progress: 0,
    rewards: "Cardio King badge + 750 points",
    difficulty: "Medium",
    icon: "❤️",
    color: "from-pink-400 to-red-500"
  },
  {
    id: 4,
    name: "Yoga Journey",
    description: "Complete 50 yoga sessions",
    category: "Wellness",
    status: "Completed",
    participants: 234,
    maxParticipants: 300,
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    progress: 100,
    rewards: "Yoga Master badge + 600 points",
    difficulty: "Easy",
    icon: "🧘",
    color: "from-purple-400 to-indigo-500"
  },
  {
    id: 5,
    name: "HIIT Champion",
    description: "Complete 20 HIIT workouts",
    category: "Intensity",
    status: "Active",
    participants: 445,
    maxParticipants: 500,
    startDate: "2024-01-10",
    endDate: "2024-02-10",
    progress: 60,
    rewards: "HIIT Warrior badge + 800 points",
    difficulty: "Hard",
    icon: "⚡",
    color: "from-yellow-400 to-orange-500"
  }
]

const topParticipants = [
  {
    id: 1,
    name: "Alex Rodriguez",
    challenge: "30-Day Fitness Challenge",
    progress: 100,
    rank: 1,
    avatar: "AR",
    points: 2847
  },
  {
    id: 2,
    name: "Sarah Johnson",
    challenge: "Strength Training Pro",
    progress: 95,
    rank: 2,
    avatar: "SJ",
    points: 2634
  },
  {
    id: 3,
    name: "Mike Chen",
    challenge: "Cardio Master",
    progress: 88,
    rank: 3,
    avatar: "MC",
    points: 2498
  },
  {
    id: 4,
    name: "Emma Wilson",
    challenge: "Yoga Journey",
    progress: 100,
    rank: 4,
    avatar: "EW",
    points: 2356
  },
  {
    id: 5,
    name: "David Park",
    challenge: "HIIT Champion",
    progress: 92,
    rank: 5,
    avatar: "DP",
    points: 2234
  }
]

export function ChallengesManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || challenge.status === selectedStatus
    const matchesCategory = selectedCategory === "all" || challenge.category === selectedCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Upcoming": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Completed": return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "Paused": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Hard": return "bg-red-500/20 text-red-400 border-red-500/30"
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 60) return "bg-yellow-500"
    if (progress >= 40) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Challenges Management</h1>
        <p className="text-slate-400 mt-2">Create and manage fitness challenges to engage your community.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-green-400 to-blue-500">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Active Challenges</p>
                <p className="text-2xl font-bold text-white">{challenges.filter(c => c.status === "Active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-blue-400 to-purple-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Total Participants</p>
                <p className="text-2xl font-bold text-white">{challenges.reduce((sum, c) => sum + c.participants, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-500">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Completed</p>
                <p className="text-2xl font-bold text-white">{challenges.filter(c => c.status === "Completed").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Avg. Progress</p>
                <p className="text-2xl font-bold text-white">{Math.round(challenges.reduce((sum, c) => sum + c.progress, 0) / challenges.length)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            placeholder="Search challenges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-md focus:border-green-500 focus:ring-green-500"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
            <option value="Paused">Paused</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-md focus:border-green-500 focus:ring-green-500"
          >
            <option value="all">All Categories</option>
            <option value="Consistency">Consistency</option>
            <option value="Strength">Strength</option>
            <option value="Cardio">Cardio</option>
            <option value="Wellness">Wellness</option>
            <option value="Intensity">Intensity</option>
          </select>
          <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Create Challenge
          </Button>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredChallenges.map((challenge) => (
          <Card key={challenge.id} className="bg-slate-900 border-slate-800 hover:border-green-500/30 transition-all duration-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${challenge.color} flex items-center justify-center text-2xl`}>
                  {challenge.icon}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 bg-slate-800 border-slate-700">
                    <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Challenge
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                      <Users className="w-4 h-4 mr-2" />
                      View Participants
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-slate-700">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Challenge
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="text-white">{challenge.name}</CardTitle>
              <CardDescription className="text-slate-400">{challenge.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(challenge.status)}>
                  {challenge.status}
                </Badge>
                <Badge className={getDifficultyColor(challenge.difficulty)}>
                  {challenge.difficulty}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-white">{challenge.progress}%</span>
                </div>
                <Progress value={challenge.progress} className="h-2" />
              </div>
              
              <div className="text-sm text-slate-400 space-y-1">
                <p><strong>Participants:</strong> {challenge.participants}/{challenge.maxParticipants}</p>
                <p><strong>Duration:</strong> {challenge.startDate} - {challenge.endDate}</p>
                <p><strong>Rewards:</strong> {challenge.rewards}</p>
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 flex-1">
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 flex-1">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Participants */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Top Challenge Participants</CardTitle>
          <CardDescription className="text-slate-400">
            Leading participants across all active challenges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topParticipants.map((participant) => (
              <div key={participant.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8">
                    {participant.rank === 1 ? (
                      <Trophy className="w-5 h-5 text-yellow-400" />
                    ) : participant.rank === 2 ? (
                      <Trophy className="w-5 h-5 text-gray-400" />
                    ) : participant.rank === 3 ? (
                      <Trophy className="w-5 h-5 text-orange-600" />
                    ) : (
                      <span className="w-5 h-5 text-center text-sm font-bold text-slate-400">{participant.rank}</span>
                    )}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white">
                      {participant.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">{participant.name}</p>
                    <p className="text-xs text-slate-400">{participant.challenge}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{participant.points}</p>
                    <p className="text-xs text-slate-400">points</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    {participant.progress}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
