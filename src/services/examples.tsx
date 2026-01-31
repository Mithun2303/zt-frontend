/**
 * Example Component - Demonstrates how to use the services
 *
 * This file shows practical examples of using the API services
 * in React components with proper error handling and loading states.
 */

import { useState, useEffect } from 'react';
import {
  authService,
  userProgressService,
  teamService,
  type Level,
  type Challenge,
  type Team,
} from '@/services';

// Example 1: Login Component
export const LoginExample = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login({ email, password });
      console.log('Login successful:', response);
      // Redirect to dashboard or home page
      window.location.href = '/home';
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Email'
        required
      />
      <input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Password'
        required
      />
      {error && <p className='error'>{error}</p>}
      <button type='submit' disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

// Example 2: Levels List Component
export const LevelsExample = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const data = await userProgressService.getLevels();
      setLevels(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load levels');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading levels...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='levels-container'>
      {levels.map((level) => (
        <div
          key={level.id}
          className={`level ${level.isUnlocked ? 'unlocked' : 'locked'}`}
        >
          <h3>{level.name}</h3>
          <p>{level.description}</p>
          {level.progress && (
            <div className='progress'>
              {level.progress.completed} / {level.progress.total} challenges
              completed
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Example 3: Challenge Detail Component
export const ChallengeExample = ({
  levelId,
  challengeId,
}: {
  levelId: string;
  challengeId: string;
}) => {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchChallenge();
  }, [levelId]);

  const fetchChallenge = async () => {
    try {
      const challenges = await userProgressService.getLevel(levelId);
      const found = challenges.find((c) => c.id === challengeId);
      setChallenge(found || null);
    } catch (err: any) {
      console.error('Failed to load challenge:', err);
    }
  };

  const handleUseHint = async (hintId: string) => {
    try {
      const hint = await userProgressService.useHint({
        challengeId,
        hintId,
      });
      setMessage(`Hint revealed! Points reduced by ${hint.pointReduction}`);
      fetchChallenge(); // Refresh to show used hint
    } catch (err: any) {
      setMessage(err.message || 'Failed to use hint');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await userProgressService.solveChallenge({
        levelId,
        challengeId,
        answer,
      });

      if (result.success) {
        setMessage(`Correct! You earned ${result.pointsEarned} points!`);
        if (result.nextLevelUnlocked) {
          setMessage((prev) => prev + ' Next level unlocked!');
        }
      } else {
        setMessage('Incorrect answer. Try again!');
      }
    } catch (err: any) {
      setMessage(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (!challenge) return <div>Loading challenge...</div>;

  return (
    <div className='challenge-detail'>
      <h2>{challenge.title}</h2>
      <div className='challenge-info'>
        <span className='category'>{challenge.category}</span>
        <span className='difficulty'>{challenge.difficulty}</span>
        <span className='points'>{challenge.points} points</span>
      </div>

      <p className='description'>{challenge.description}</p>

      {/* Hints Section */}
      <div className='hints'>
        <h3>Hints</h3>
        {challenge.hints.map((hint) => (
          <div key={hint.id} className='hint'>
            {hint.isUsed ? (
              <p>{hint.content}</p>
            ) : (
              <button onClick={() => handleUseHint(hint.id)}>
                Use Hint (-{hint.pointReduction} points)
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Files Section */}
      {challenge.files && challenge.files.length > 0 && (
        <div className='files'>
          <h3>Download Files</h3>
          {challenge.files.map((file) => (
            <a
              key={file.id}
              href={file.url}
              target='_blank'
              rel='noopener noreferrer'
            >
              {file.name}
            </a>
          ))}
        </div>
      )}

      {/* Submit Answer */}
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder='ZeroTrace(...)'
          required
        />
        <button type='submit' disabled={loading || challenge.isSolved}>
          {loading
            ? 'Submitting...'
            : challenge.isSolved
              ? 'Solved'
              : 'Submit Flag'}
        </button>
      </form>

      {message && <p className='message'>{message}</p>}
    </div>
  );
};

// Example 4: Team Creation Component
export const TeamCreationExample = () => {
  const [teamName, setTeamName] = useState('');
  const [member2Email, setMember2Email] = useState('');
  const [member3Email, setMember3Email] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await teamService.createTeam({
        teamName,
        teamMember2Email: member2Email || undefined,
        teamMember3Email: member3Email || undefined,
      });
      console.log('Team created:', response);
      // Redirect or show success message
    } catch (err: any) {
      setError(err.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreateTeam}>
      <input
        type='text'
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder='Team Name'
        required
      />
      <input
        type='email'
        value={member2Email}
        onChange={(e) => setMember2Email(e.target.value)}
        placeholder='Member 2 Email (optional)'
      />
      <input
        type='email'
        value={member3Email}
        onChange={(e) => setMember3Email(e.target.value)}
        placeholder='Member 3 Email (optional)'
      />
      {error && <p className='error'>{error}</p>}
      <button type='submit' disabled={loading}>
        {loading ? 'Creating...' : 'Create Team'}
      </button>
    </form>
  );
};

// Example 5: My Team Component
export const MyTeamExample = () => {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const data = await teamService.getMyTeam();
      setTeam(data);
    } catch (err: any) {
      console.error('Failed to load team:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading team...</div>;
  if (!team) return <div>No team found</div>;

  return (
    <div className='team-info'>
      <h2>{team.teamName}</h2>
      <h3>Members:</h3>
      <ul>
        {team.members.map((member) => (
          <li key={member.id}>
            {member.name} ({member.email})
          </li>
        ))}
      </ul>
    </div>
  );
};
