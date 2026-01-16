import numpy as np

class EmotionWheel:
    """
    Represents the emotional state of the system, which regulates dopamine.
    Categories: Ego, Excitement, Angry, Happy, Sad
    """
    def __init__(self):
        self.states = {
            "ego": 0.2,
            "excitement": 0.2,
            "angry": 0.0,
            "happy": 0.5,
            "sad": 0.1
        }
        self.categories = list(self.states.keys())

    def update_from_spike(self, value_spike):
        """
        Update emotional states based on a 'Value Spike' (external reward/input).
        value_spike: dict of {category: delta}
        """
        for cat, delta in value_spike.items():
            if cat in self.states:
                self.states[cat] = np.clip(self.states[cat] + delta, 0.0, 1.0)
        
    def get_dopamine_influence(self):
        """
        Calculate a global dopamine modulation factor based on emotions.
        Excitement and Happy increase dopamine; Sad and Angry might suppress or destabilize it.
        """
        dopamine_factor = (self.states["excitement"] * 1.5 + 
                          self.states["happy"] * 1.0 + 
                          self.states["ego"] * 0.5 - 
                          self.states["sad"] * 0.5)
        return np.clip(dopamine_factor, 0.1, 2.0)

class DopamineSystem:
    """
    Regulates threshold, energy, and tokens for the SNN.
    """
    def __init__(self):
        self.base_threshold = 1.0
        self.base_energy = 100.0
        self.current_dopamine = 1.0

    def modulate(self, emotion_wheel):
        self.current_dopamine = emotion_wheel.get_dopamine_influence()
        
        # High dopamine lowers threshold (more excitable)
        modulated_threshold = self.base_threshold / self.current_dopamine
        # High dopamine increases available energy/tokens
        available_energy = self.base_energy * self.current_dopamine
        
        return {
            "threshold": modulated_threshold,
            "energy": available_energy,
            "dopamine_level": self.current_dopamine
        }
