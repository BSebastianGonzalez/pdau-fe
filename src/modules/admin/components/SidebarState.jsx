import StatusTag from "../../../components/StatusTag";

const SidebarState = ({ estado }) => (
  <div className="bg-purple-200 rounded-lg p-4 shadow flex flex-col items-center">
    <div className="font-bold mb-3 bg-gray-900 text-white px-4 py-2 rounded text-center">
      Estado actual
    </div>
    <div className="mt-1 w-full flex justify-center">
      <StatusTag
        text={estado?.nombre}
        className="text-lg font-bold px-6 py-2 rounded-lg shadow bg-white text-purple-900 border border-purple-300"
      />
    </div>
  </div>
);

export default SidebarState;