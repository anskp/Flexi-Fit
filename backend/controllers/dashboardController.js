// src/controllers/dashboardController.js
import * as dashboardService from '../services/dashboardService.js';
import * as authService from '../services/authService.js';
import catchAsync from '../utils/catchAsync.js';

// Helper function to get user ID from either JWT or Auth0
const getUserId = async (req) => {
  // If Auth0 middleware was used
  if (req.auth?.payload) {
    console.log('[DashboardController] Using Auth0 user ID from payload');
    // Get our DB user ID from Auth0 sub
    const user = await authService.getUserByAuth0Id(req.auth.payload.sub);
    return user.id;
  }
  // If JWT middleware was used
  console.log('[DashboardController] Using JWT user ID');
  return req.user?.id;
};

export const getMemberDashboard = catchAsync(async (req, res, next) => {
  const userId = await getUserId(req);
  const dashboardData = await dashboardService.buildMemberDashboard(userId);
  
  res.status(200).json({
    success: true,
    data: dashboardData,
  });
});

