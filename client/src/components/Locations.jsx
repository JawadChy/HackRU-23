export default function Locations({ facilities }) {
  return (
    <div className="locations-card">
      {facilities.length === 0 ? (
        <p>Select a bus stop to view nearby medical facilities.</p>
      ) : (
        <>
          <h2>Nearby Medical Facilities</h2>
          <ul>
            {facilities.map((facility, index) => (
              <li key={index}>
                <strong>{facility.name}</strong><br />
                {facility.address}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}