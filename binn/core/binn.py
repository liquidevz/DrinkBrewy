import numpy as np
from .neuromodulation import EmotionWheel, DopamineSystem
from .snn import SNNLayer
from .memory import SSMMemory

class BINN:
    """
    Biology-Informed Neural Network (BINN)
    Integrates Emotion, Dopamine, SNN, and SSM Memory.
    """
    def __init__(self, input_dim, hidden_dim, output_dim):
        self.emotion_wheel = EmotionWheel()
        self.dopamine_system = DopamineSystem()
        
        self.snn_layer = SNNLayer(input_dim, hidden_dim)
        self.output_layer = SNNLayer(hidden_dim, output_dim)
        
        self.memory = SSMMemory(state_dim=hidden_dim, input_dim=output_dim)
        
        self.time = 0.0
        self.dt = 1.0 # ms

    def step(self, input_spikes, current_inputs=None):
        """
        Perform one time step of the BINN.
        current_inputs: dict of {emotion_category: current_in_amperes}
        """
        # 1. Update Emotions if there's electronic current input
        if current_inputs:
            self.emotion_wheel.update_from_current(current_inputs, self.dt)
            
        # 2. Get Dopamine Modulation
        modulation = self.dopamine_system.modulate(self.emotion_wheel)
        threshold = modulation["threshold"]
        
        # 3. SNN Forward Pass
        hidden_spikes = self.snn_layer.forward(input_spikes, self.time, self.dt, threshold)
        output_spikes = self.output_layer.forward(hidden_spikes, self.time, self.dt, threshold)
        
        # 4. Update Memory (SSM)
        # Memory stores a compressed representation of the output activity
        memory_state = self.memory.update(output_spikes)
        
        self.time += self.dt
        
        return {
            "output_spikes": output_spikes,
            "memory_state": memory_state,
            "dopamine_level": modulation["dopamine_level"],
            "emotions": self.emotion_wheel.states.copy()
        }

    def get_status(self):
        return {
            "time": self.time,
            "emotions": self.emotion_wheel.states,
            "dopamine": self.dopamine_system.current_dopamine
        }
