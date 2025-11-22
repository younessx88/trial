export default function FeatureGrid() {
  const features = [
    {
      icon: "🚀",
      title: "Lightning Fast",
      description: "Create a leaderboard in under 30 seconds. No signup, no hassle."
    },
    {
      icon: "🔗",
      title: "Shareable Links",
      description: "Everyone with the link can view and update scores in real-time."
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      description: "Works perfectly on phones, tablets, and desktops."
    },
    {
      icon: "🎨",
      title: "Custom Branding",
      description: "Add your logo and colors with the Pro plan."
    },
    {
      icon: "🏆",
      title: "Auto Sorting",
      description: "Leaderboard automatically sorts as scores change."
    },
    {
      icon: "🎉",
      title: "Winner Celebration",
      description: "Confetti animation when someone takes the lead!"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple, powerful features to track and share scores with your team
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
