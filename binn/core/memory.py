import numpy as np

class SSMMemory:
    """
    State Space Model for low-energy memory storage.
    Uses a linear recurrence to maintain context.
    """
    def __init__(self, state_dim, input_dim):
        self.state_dim = state_dim
        self.input_dim = input_dim
        
        # Initialize SSM matrices (A, B, C)
        # Simplified: A is a decay matrix, B is input projection
        self.A = np.eye(state_dim) * 0.9  # Decay factor
        self.B = np.random.randn(state_dim, input_dim) * 0.1
        self.state = np.zeros(state_dim)

    def update(self, input_vector):
        """
        Update the hidden state: h_t = A * h_{t-1} + B * x_t
        """
        self.state = np.dot(self.A, self.state) + np.dot(self.B, input_vector)
        return self.state

    def get_context(self):
        """
        Returns the current compressed memory state.
        """
        return self.state

    def reset(self):
        self.state = np.zeros(self.state_dim)
