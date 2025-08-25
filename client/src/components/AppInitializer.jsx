import { useEffect } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { selectAuthUserId, selectAuthIsAuthenticated } from '../redux/slices/authSlice';
import { selectUserProfile, fetchUserProfile, selectUserLoading, selectUserError } from '../redux/slices/userSlice';

const AppInitializer = ({ children }) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectAuthIsAuthenticated);
  const userId = useAppSelector(selectAuthUserId);
  const user = useAppSelector(selectUserProfile);
  const userLoading = useAppSelector(selectUserLoading);
  const userError = useAppSelector(selectUserError);

  useEffect(() => {
    if (isAuthenticated && userId && !user && !userError && !userLoading) {
      dispatch(fetchUserProfile(userId));
    }
  }, [isAuthenticated, userId, user, userError, userLoading, dispatch]);

  return children;
};

export default AppInitializer; 