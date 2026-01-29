import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../API/api';
import { LogOut, BookOpen, GraduationCap, Users, FileText, CheckCircle, ClipboardList, Clock } from 'lucide-react';

const iconMap = {
    BookOpen,
    GraduationCap,
    Users,
    FileText,
    CheckCircle,
    ClipboardList,
    Clock
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const { data } = await api.get('/dashboard');
            setStats(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };
    fetchStats();
  }, []);

  const StatCard = ({ icon, title, value, color }) => {
      const Icon = iconMap[icon] || BookOpen;
      return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all cursor-pointer group">
          <div className={`p-3 rounded-lg w-fit mb-4 ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold text-white mt-1 group-hover:scale-105 transition-transform">{value}</p>
        </div>
      );
  };

  if (loading) return <div className="text-white text-center py-20">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{stats?.title || 'Dashboard'}</h1>
        <p className="text-gray-400 mt-2">Welcome back, {user?.name}. Here is your overview.</p>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats?.cards?.map((card, index) => (
              <StatCard key={index} {...card} />
          ))}
        </div>

        {/* Role Specific Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
                {/* For Students: Enrolled Courses */}
                {user?.role === 'Student' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-4">My Courses</h2>
                        {stats?.enrolledCourses?.length > 0 ? (
                            <div className="space-y-4">
                                {stats.enrolledCourses.map(course => (
                                    <div key={course._id} className="bg-black/20 p-4 rounded-xl flex justify-between items-center group hover:bg-black/30 transition-colors">
                                        <div>
                                            <h3 className="font-bold text-lg group-hover:text-blue-400">{course.title}</h3>
                                            <p className="text-sm text-gray-400 truncate max-w-md">{course.description}</p>
                                        </div>
                                        <Link to={`/courses/${course._id}`} className="px-4 py-2 bg-white/10 hover:bg-blue-600 rounded-lg text-sm transition-colors">
                                            Continue
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-400 py-8 text-center">
                                You are not enrolled in any courses. 
                                <br/>
                                <Link to="/courses" className="text-blue-400 hover:underline mt-2 inline-block">Browse Courses</Link>
                            </div>
                        )}
                    </div>
                )}

                {/* For Tutors: Recent Courses */}
                {user?.role === 'Tutor' && (
                     <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-4">Teaching Courses</h2>
                         {stats?.recentActivity?.length > 0 ? (
                            <div className="space-y-4">
                                {stats.recentActivity.map(course => (
                                    <div key={course._id} className="bg-black/20 p-4 rounded-xl flex justify-between items-center group hover:bg-black/30 transition-colors">
                                        <div>
                                            <h3 className="font-bold text-lg group-hover:text-purple-400">{course.title}</h3>
                                            <p className="text-sm text-gray-400 truncate max-w-md">{course.description}</p>
                                        </div>
                                        <Link to={`/courses/${course._id}`} className="px-4 py-2 bg-white/10 hover:bg-purple-600 rounded-lg text-sm transition-colors">
                                            Manage
                                        </Link>
                                    </div>
                                ))}
                            </div>
                         ) : (
                             <div className="text-gray-400 py-8 text-center">
                                No courses created yet.
                                <br/>
                                <Link to="/courses" className="text-purple-400 hover:underline mt-2 inline-block">Create a Course</Link>
                             </div>
                         )}
                     </div>
                )}
            </div>

            {/* Sidebar / Quick Actions */}
            <div className="space-y-6">
                 <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link to="/courses" className="block w-full py-3 px-4 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-colors">
                            {user?.role === 'Student' ? 'Find New Courses' : 'Manage Courses'}
                        </Link>
                        <Link to="/profile" className="block w-full py-3 px-4 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-colors">
                            Update Profile
                        </Link>
                         {user?.role === 'Admin' && (
                            <button className="block w-full py-3 px-4 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-colors">
                                Manage Users (Soon)
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
