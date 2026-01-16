import numpy as np

class LIFNeuron:
    """
    Leaky Integrate-and-Fire Neuron.
    """
    def __init__(self, v_rest=0.0, v_reset=0.0, tau=20.0):
        self.v_rest = v_rest
        self.v_reset = v_reset
        self.tau = 5.0
        self.v = v_rest
        self.last_spike_time = -1000.0

    def step(self, i_in, dt, threshold):
        # Leaky integration: dv/dt = (-(v - v_rest) + i_in) / tau
        dv = (-(self.v - self.v_rest) + i_in) * (dt / self.tau)
        self.v += dv
        
        spike = 0
        if self.v >= threshold:
            spike = 1
            self.v = self.v_reset
        return spike

class SNNLayer:
    """
    A layer of LIF neurons with STDP learning.
    """
    def __init__(self, n_in, n_out):
        self.n_in = n_in
        self.n_out = n_out
        self.weights = np.random.rand(n_out, n_in) * 2.0
        self.neurons = [LIFNeuron() for _ in range(n_out)]
        self.last_pre_spikes = np.zeros(n_in) - 1000.0
        
    def forward(self, in_spikes, t, dt, threshold):
        # Update last pre-synaptic spike times
        for i, s in enumerate(in_spikes):
            if s > 0: self.last_pre_spikes[i] = t
            
        # Calculate input current to each neuron
        i_in = np.dot(self.weights, in_spikes)
        
        out_spikes = []
        for i, neuron in enumerate(self.neurons):
            s = neuron.step(i_in[i], dt, threshold)
            out_spikes.append(s)
            if s > 0:
                neuron.last_spike_time = t
                # Apply STDP learning
                self._apply_stdp(i, t)
        
        return np.array(out_spikes)

    def _apply_stdp(self, post_idx, t_now):
        """
        Simplified Spike-Timing-Dependent Plasticity.
        If pre-spike happened just before post-spike, strengthen weight (LTP).
        If pre-spike happened just after (not possible in this step, but conceptually), weaken (LTD).
        """
        tau_stdp = 20.0
        a_plus = 0.01
        
        for pre_idx in range(self.n_in):
            dt = t_now - self.last_pre_spikes[pre_idx]
            if dt > 0:
                # Long-Term Potentiation
                dw = a_plus * np.exp(-dt / tau_stdp)
                self.weights[post_idx, pre_idx] += dw
                # Clip weights to prevent explosion
                self.weights[post_idx, pre_idx] = np.clip(self.weights[post_idx, pre_idx], 0, 2.0)
